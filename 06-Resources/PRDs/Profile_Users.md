# Profile: Users

---

> Lighter spec derived from the Profile: Users discovery document. Covers user self-service profile, owner company settings, security, notification preferences, and support/feedback.

**Related PRDs:** [Communication.md](./Communication.md) + [Notifications.md](./Notifications.md) (email/push toggles and delivery), [User_Management.md](./User_Management.md) (admin edit of same fields), [Theming.md](./Theming.md) (owner theme). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

# Problem Statement

Employees need a place to view the information their company holds about them and to update the details they control (cell number, email, profile picture). Owners additionally need access to company-level settings. Without self-service profile management, every minor update — a phone number change, a language preference — becomes a support ticket or HR request.

---

# Goals

1. **Enable employee self-service** — Users can update their mobile, email, profile picture, and language without HR involvement.
1. **Provide transparency** — Employees can see what data the company holds about them.
1. **Give owners company-level control** — Owners can update company info and theme from their profile.
1. **Support basic security and preferences** — Password management and notification toggles.
---

# Non-Goals

- **Full profile editing by users** — Users can only edit mobile, email, language, and profile picture. All other fields are HR-managed via import.
- **Multi-factor authentication settings** — MFA configuration is future scope.
- **In-app user guides (native)** — Phase 1 links to external PDF guides only.
- **Custom notification categories** — Phase 1 is simple on/off for email and push.
---

# User Stories

- As an **employee**, I want to update my mobile number so that I receive OTPs and invites at the right number.
- As an **employee**, I want to see my imported details (department, position, DOB, etc.) so that I can verify my information is correct.
- As an **employee**, I want to change my password so that I can keep my account secure.
- As an **employee**, I want to toggle email and push notifications on/off so that I control how I'm contacted.
- As an **owner**, I want to update company information and theme settings from my profile so that the app reflects our brand.
---

# Requirements

## Must-Have (P0)

### Profile Views

- [ ] **Admin/Standard:** Profile overview (picture, name, position). Sections: My Details, Security, Notifications. Plus: Guides, Feedback, Support, Legal. Logout.
- [ ] **Owner:** Same as above plus Company Account section: Company Information + Theme.
### Self-Service Updates

- [ ] Users can update: Email, Mobile number, Language, Profile picture.
- [ ] Success alerts: "Your phone number has been updated" / "Your email has been updated."
### Displayed Information (Read-Only)

- [ ] From import: Name, Surname, Employee ID, Gender, DOB, Mobile, Country, City, Region, Work email, Work number, Position, Department, Division, Language, Role.
- [ ] Info panel: "Incorrect info? Contact HR."
- [ ] Owner sees company info: Company Name, Industry, Employee count, Country, Region, City, Zip Code.
### Security

- [ ] User can update their password. Implementation may use a link-based flow (no direct IDP access).
### Notification Preferences

- [ ] Toggle on/off: Email notifications, Push notifications.
### Support & Feedback

- [ ] Feedback form + Support form. Response message after submission.
### Guides

- [ ] Links to PDF user guides (Owner/Admin manual, Standard user manual).
## Nice-to-Have (P1)

- [ ] Profile picture cropping/resizing tool.
- [ ] Email verification flow before updating email (OTP to new email).
- [ ] Richer notification preferences (per-category toggles).
---

# Success Metrics

**Leading:**

- % of mobile number updates completed self-service vs support ticket (target: >90% self-service)
- Profile page visits per user per month (engagement indicator)
**Lagging:**

- Reduction in profile-related support tickets (target: -70%)
- Data accuracy improvement (% of users with valid mobile numbers)
---

# Open Questions

- **[Engineering]** How does password change work without direct IDP access — reset link via email/SMS?
- **[Product]** Should email updates require verification (OTP to new email) before taking effect?
- **[Design]** Where does the owner theme editor live — inside profile, or a separate settings area?
- **[Product]** Should users be able to see their own audit log (login history, profile changes)?
