### Pull Request Details

Thank you for contributing to **EventSapien**!

Please indicate the type of contribution:
- [ ] **Event Submission** (Adding or updating a student event in `events/`)
- [ ] **Website / Code Edit** (Improving the platform, fixing bugs, UI enhancements)

---

### If Submitting an Event (see [ADDING_AN_EVENT.md](ADDING_AN_EVENT.md))
- **Event Name:** 
- **Organizing College / Club:** 
- **Event Date(s):** YYYY-MM-DD
- **Registration Deadline:** YYYY-MM-DD (or N/A)
- **Participation Mode:** [ ] Offline [ ] Online [ ] Hybrid
- **Registration URL:** 

#### Event Contributor Checklist
- [ ] Added my event file inside `events/<event-slug>.toml` (lowercase kebab-case).
- [ ] Did **NOT** edit `src/data/archived.json` manually (archiving is automated).
- [ ] All required fields (`title`, `description`, `organizer`, `category`, `mode`, `event_date`) are provided.
- [ ] Dates follow `YYYY-MM-DD`.
- [ ] Ran `npm run validate` locally (or used the website generator) and validated successfully.

---

### If Contributing Code / Website Edits (see [CONTRIBUTING.md](CONTRIBUTING.md))
- **Summary of changes:** 
- **Related issue / discussion:** 
- [ ] Verified build succeeds with `npm run build`.
- [ ] Verified TypeScript passes with `npm run lint`.
- [ ] Followed the repository's styling and zero-pill typographic design principles.
