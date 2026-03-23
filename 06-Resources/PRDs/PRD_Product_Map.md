# PRD product map — how the specs fit together

**Purpose:** Single place for **dependencies**, **shared concepts**, and **canonical rules** when individual PRDs overlap. Use this during refinement, sequencing, and QA. Feature PRDs remain the detailed source; this map is the integration layer.

**Hub:** [Requirements.md](./Requirements.md) · **Index:** [README.md](./README.md)

---

## 1. Core content loop (audience → publish → surface)

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart LR
  subgraph people [People and data]
    UM[User Importer]
    UMG[User Management]
    PR[Profile: Users]
  end
  subgraph audience [Audience]
    GR[Groups]
  end
  subgraph content [Content]
    PO[Posts incl Phase 2 templates]
  end
  subgraph surface [Surfaces]
    FE[Feed]
    NT[Notifications]
  end
  UM --> GR
  UMG --> GR
  GR --> PO
  PO --> FE
  PO --> NT
  GR --> NT
```

**Product intent:** **Groups define who a post is for; the feed is where those users see it.** Posts without a resolved audience are incomplete — targeting is not optional for publish ([Posts.md](./Posts.md)). The **system “Everyone”** group ([Groups.md](./Groups.md)) is the exception for broadcast-style sends; prefer saved or once-off groups when the story is not truly company-wide.

| Capability | PRDs involved |
|------------|----------------|
| Keys for query builder / segments | [User_Importer.md](./User_Importer.md) (imported fields) → [Groups.md](./Groups.md) |
| Attach audience + publish | [Groups.md](./Groups.md) ↔ [Posts.md](./Posts.md) |
| Employee sees content | [Feed.md](./Feed.md) (group membership + LIFO) |
| Optional publish alerts | [Posts.md](./Posts.md) toggle → [Notifications.md](./Notifications.md) → [Communication.md](./Communication.md) |
| Extended templates (PDF, video, external form link) | [Posts.md](./Posts.md) Phase 2; rendered on [Feed.md](./Feed.md) |

**Derived QA layer:** [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) — feed + urgent pin; keep in sync with [Feed.md](./Feed.md) and [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md). **All feature AC files:** see [README.md](./README.md) § Acceptance criteria.

---

## 2. Messaging and the feed (parallel to posts)

[Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) uses the **same audience primitives** as posts ([Groups.md](./Groups.md): Everyone, saved group, directory, new group). **Urgent** alerts add takeover + **pinned block on the feed**; **operational** messages must not pollute the feed as pinned content. Coordinate ordering with [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) (PIN-*, SF-05).

---

## 3. Identity, tenant, and first run

| Layer | PRD |
|--------|-----|
| Tenant creation, QR, identifiers | [Tenant_Management.md](./Tenant_Management.md) |
| SMS/email/push plumbing | [Communication.md](./Communication.md) |
| Activation & login UX | [Login_Account_Activation.md](./Login_Account_Activation.md) |
| Branding | [Theming.md](./Theming.md) (owner profile / tenant) |

**Happy path after login:** user lands on **feed** ([Login_Account_Activation.md](./Login_Account_Activation.md), [Feed.md](./Feed.md)).

---

## 4. Canonical rules where PRDs touched the same behaviour

### 4.1 Post visibility, archive, and retention (employee vs admin)

**Canonical for what employees see on the main feed and in search:** [Feed.md](./Feed.md) and [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md).

| Topic | Rule (Phase 1) | Detailed spec |
|--------|----------------|---------------|
| Time on **employee** main feed | **3 months** from publish unless post is **permanent** | [Feed.md](./Feed.md) § Archiving; Feed AC ARC-* |
| **Employee** search/filter | **No** archived posts | Feed AC ARC-04 |
| **Admin** archive surface | Admins can find/manage posts no longer on main feed | Feed AC ARC-01, ARC-05 |
| Long-term purge | **12 months** after archive (clock as defined in tech/legal); tenant policy may vary | Feed AC ARC-02 |
| Admin **dashboard** statuses (Draft / Published / Archived / Deleted) | Workflow labels in [Posts.md](./Posts.md); **timestamps for “off feed”** follow Feed above | [Posts.md](./Posts.md) |

If legacy drafts used different numbers (**60 days** / **30 days**), **do not implement from those in isolation** — reconcile in backlog against this table.

### 4.2 Notifications vs communication

- **Notification types, drawer, severity, actions:** [Notifications.md](./Notifications.md)
- **Channels (FCM, APNs, HMS, SMS, email) and delivery:** [Communication.md](./Communication.md)
- **Post publish** uses product toggles in Posts; **delivery** honours Profile notification switches ([Profile_Users.md](./Profile_Users.md)).

---

## 5. Suggested build order (dependency-aware)

1. **Tenant_Management** → **Communication** (minimal) → **User_Importer** → **User_Management** / **Profile_Users**
2. **Groups** (needs import keys + directory from importer / user management)
3. **Posts** + **Feed** in tight iteration (publish → see in feed); **Notifications** for publish path
4. **Messaging_Ops_Urgent_Alerts** (groups + communication + feed pin)
5. **Posts Phase 2** (PDF / Video / external form link) after core posts + feed + Cloudflare readiness
6. **Theming** in parallel where tenant login/app shell needs it

---

## 6. Acceptance criteria index (QA layer)

Each PRD can have a companion `*_acceptance_criteria.md` with testable **Given / When / Then** rows, edge cases, and “outstanding” items. **Index:** [README.md](./README.md) § Acceptance criteria.

**Discovery evidence (optional):** Link contentious or discovery-heavy AC rows to `EV-*` IDs via [Evidence_and_traceability.md](./Evidence_and_traceability.md) and [Evidence_register.md](./Evidence_register.md).

**Cross-PRD questions** that only arise from wiring multiple specs: [PRD_Cross_cutting_open_questions.md](./PRD_Cross_cutting_open_questions.md).

---

## 7. Cross-reference maintenance

When changing **feed visibility**, **archive**, **groups audience**, or **pinned urgent** behaviour, update **this map §4** and the linked sections in **Feed**, **Feed_acceptance_criteria**, **Posts**, **Groups**, and **Messaging** so QA has one story.

**Canonical spec:** Extended post formats (PDF, Video, external form link) are specified in **[Posts.md](./Posts.md)** (Phase 2). Do not maintain a duplicate standalone Post Extensions doc.
