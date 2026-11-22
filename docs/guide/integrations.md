---
title: "Integrations"
description: "Send contacts and sold-project updates to EstimateSync, or receive estimate and project events in another system."
"source packet": "account-settings-portal-packet.md"
audience: "signed-up users; account admins; integration developers"
"intended URL": "/docs/guide/integrations"
"review status": "needs copy review"
"publish status": "ready for staging"
"source file": "../docs/publish/guide/integrations.md"
---

# Integrations

EstimateSync connects to a CRM, form builder, spreadsheet, or automation
service. It can receive data from those systems and send data to them:

- Inbound endpoints accept contacts and sold-project updates from another
  system.
- Outbound webhooks notify another system when an estimate is sent or a
  project is marked sold.

Open [Webhooks in the account console](https://estimatesync.com/console/webhooks)
to copy your inbound URLs and secret keys, or to save the URL that receives
outbound events.

## Inbound endpoints

Inbound endpoints let another system send a JSON request to EstimateSync. The
two endpoints have separate secret keys. Use the secret shown on the same card
as the endpoint you are calling.

The URL shown in the console includes your organization ID as an `orgId` query
parameter. Send the secret key in the `x-api-secret` header. Do not put the
secret in the URL or JSON body.

Every inbound request uses these headers:

```text
Content-Type: application/json
x-api-secret: <your secret key>
```

Rotating a secret makes the old value stop working immediately. Update the
calling system with the new value before sending another request.

### Import a contact

Use the inbound contacts endpoint to add a website or social media lead to your
EstimateSync contacts. Send a JSON `POST` to:

```text
https://api.estimatesync.com/v1/inboundContacts?orgId=YOUR_ORG_ID
```

The request body accepts these fields:

```json
{
  "name": "Jane Customer",
  "email": "jane@example.com",
  "phone": "+1 202-555-0100",
  "address": "123 Main St",
  "externalId": "lead-123"
}
```

`name` is required. The other fields are optional. An `externalId` is useful
when the contact already has a stable ID in your CRM or form service. Sending
that ID again updates the same EstimateSync contact. When there is no external
ID, EstimateSync uses the email address to find the matching contact. If
neither value is present, each request creates a new contact.

When you update a contact, include every optional value you want to keep.
Omitted optional fields are cleared on the matching contact.

A successful request returns HTTP 200 and the saved contact ID:

```json
{
  "success": true,
  "id": "CONTACT_ID"
}
```

### Mark a project sold

Use the inbound sales endpoint when another system should mark an existing
EstimateSync project as sold. Send a JSON `POST` to:

```text
https://api.estimatesync.com/v1/inboundSales?orgId=YOUR_ORG_ID
```

The invoice number is the preferred identifier for this endpoint:

```json
{
  "invoiceNumber": "EST-1234"
}
```

You can use the EstimateSync project ID when your integration already stores
it:

```json
{
  "projectId": "ESTIMATESYNC_PROJECT_ID"
}
```

Use one identifier per request. If both are present, EstimateSync uses
`projectId`. The project must belong to the organization in the endpoint URL
and must already be sent or under revision.

This request marks the project sold, locks the applicable estimate version,
updates its invoice and payment summary, and prepares the sold-project emails.
It does not record a payment.

A successful transition returns HTTP 200:

```json
{
  "success": true,
  "message": "Project marked as sold",
  "projectId": "ESTIMATESYNC_PROJECT_ID",
  "paymentRequestId": null,
  "paymentRequestEmailQueued": false
}
```

`paymentRequestId` is `null` unless your organization has a default deposit
configured. A first sale through this endpoint applies that default the same
way the app does: the invoice email shows it as Deposit Due Now and
`paymentRequestId` carries the linked deposit request. The endpoint never queues
a separate payment request email, so `paymentRequestEmailQueued` is always
`false`.

Sending the request again for an already-sold project is safe. EstimateSync
returns HTTP 200 without repeating the transition:

```json
{
  "success": true,
  "message": "Project is already sold",
  "projectId": "ESTIMATESYNC_PROJECT_ID",
  "alreadysold": true
}
```

### Inbound errors

Use the HTTP status and response message to diagnose a rejected request:

| Status | Meaning |
| --- | --- |
| `400` | A required JSON field is missing. Contacts require `name`; sales require `invoiceNumber` or `projectId`. |
| `401` | The `orgId` query parameter or `x-api-secret` header is missing. |
| `403` | The secret is wrong, or a supplied project ID belongs to another organization. |
| `404` | The organization, project, or invoice number could not be found. |
| `500` | EstimateSync could not save the contact or complete the sale transition. |

## Outbound webhooks

An outbound webhook sends project data from EstimateSync to a URL you control.
Save that URL in the Estimate Ready Notification card in the account console.
EstimateSync sends a JSON `POST` when an estimate is sent or a project is
marked sold. Your endpoint should return a `2xx` response.

### What EstimateSync sends

Every outbound request includes these headers:

```text
Content-Type: application/json
X-Organization-Id: YOUR_ORG_ID
X-Source: EstimateSync
X-Hub-Signature: sha256=<hex digest>
```

`X-Hub-Signature` is included when you enable a webhook secret. To verify the
request, calculate an HMAC-SHA256 digest of the exact request body using the
secret shown in the console. Add `sha256=` before the hexadecimal digest and
compare that value with the signature header. The header is omitted when no
webhook secret is enabled.

The outbound webhook secret is only for signature verification. It is separate
from the `x-api-secret` values used by the inbound endpoints.

Here is an `estimate.sent` example:

```json
{
  "meta": {
    "eventId": "...",
    "eventType": "estimate.sent",
    "timestamp": "2026-09-15T14:30:00.000Z"
  },
  "project": {
    "id": "...",
    "contactId": "...",
    "invoiceUrl": "https://estimatesync.com/estimate?...",
    "workUrl": "https://estimatesync.com/work?...",
    "clientName": "Jane Customer",
    "email": "jane@example.com",
    "phone": "+1 202-555-0100",
    "address": "123 Main St",
    "summary": "Interior repaint",
    "invoiceNumber": "EST-1234"
  },
  "status": {
    "previous": "drafting",
    "current": "sent",
    "isSale": false
  },
  "financials": {
    "totalPrice": 4068.25,
    "laborTotal": 3078.75,
    "materialsTotal": 989.5,
    "dailyRate": 475.79
  },
  "estimates": {
    "totalHours": 68.4,
    "totalDays": 8.55,
    "gallons": {
      "wall": 32.4,
      "ceiling": 0,
      "trim": 0,
      "total": 32.4
    }
  }
}
```

`meta.eventType` is `estimate.sent` when an estimate is sent and
`estimate.complete` when a project is marked sold. For a sold project,
`status.current` is `sold` and `status.isSale` is `true`.

Financial amounts use dollars. Estimate totals use hours, eight-hour workdays,
and gallons. The project object includes the customer details and the invoice
and work page URLs.

Use **Send Test Data** in the console after saving the outbound URL. The test
sends a sample `estimate.sent` event and displays the status and response body
returned by your endpoint. It does not call either inbound endpoint.

## Related guides

- [Account Settings and Portal](/docs/guide/account-settings)
- [Contacts and Appointments](/docs/guide/contacts-appointments)
- [Projects, Estimates, Invoices, and Payments](/docs/guide/projects-estimates-invoices)
