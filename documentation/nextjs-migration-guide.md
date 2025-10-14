# ClinicCases Data Schema and Next.js Migration Reference

This guide summarizes the relational data model that powers ClinicCases, catalogs the PHP templates that compose its user interface, and outlines how to reproduce the application with a modern Next.js front end backed by PostgreSQL.

## 1. Data schema overview

### 1.1 Core cases table (`cm`)
* Stores the primary case record, including identifiers, client names, organizational details, open/close timestamps, and auditing metadata for who opened or closed the matter.【F:lib/php/data/cases_case_data_load.php†L15-L34】【F:lib/php/data/cases_detail_tab_case_name.php†L9-L18】
* When administrators delete a case, ClinicCases preserves only essential columns (`id`, `clinic_id`, name fields, lifecycle timestamps) and clears all other values before flagging the record as deleted to maintain numbering continuity.【F:lib/php/data/cases_case_data_process.php†L161-L205】
* Case deletion also cascades into associated tables, removing adverse parties, assignments, notes, contacts, documents, messages, events, and event responsibility rows for the matter.【F:lib/php/data/cases_case_data_process.php†L206-L243】

### 1.2 Case column configuration (`cm_columns`)
* Holds the metadata for every column displayed on case forms and lists. Each record specifies the backing database field (`db_name`), label (`display_name`), visibility flags, input widget type, selectable options, required state, and ordering.【F:documentation/customization.md†L31-L61】
* Case data loaders pull this configuration at runtime and pair each column definition with the corresponding value from `cm`, enabling dynamic, customizable forms.【F:lib/php/data/cases_case_data_load.php†L20-L34】
* Any new custom field must be added to both `cm` and `cm_columns` so the metadata and storage remain synchronized.【F:documentation/customization.md†L31-L37】

### 1.3 Case assignments (`cm_case_assignees`)
* Tracks which users are assigned to a case alongside their assignment status and timestamps.【F:lib/php/users/add_user_to_case.php†L35-L76】
* Active assignments drive the default case list query, limiting non-admin users to matters where they are marked as active assignees.【F:lib/php/data/cases_load.php†L20-L49】

### 1.4 Case notes (`cm_case_notes`)
* Stores chronological notes with separate date, second-of-day time, free-text description, author username, and full timestamp for auditing.【F:lib/php/data/cases_casenotes_process.php†L14-L49】

### 1.5 Contacts (`cm_contacts`)
* Records party information tied to a case, including first/last name, organization, type (client, witness, etc.), address fields, phones, email, URL, and a notes field.【F:lib/php/data/cases_contacts_process.php†L11-L82】

### 1.6 Documents (`cm_documents`)
* Manages uploaded files, document templates, folders, and URLs with metadata such as display name, stored file name, extension, folder hierarchy, editable text, writer permissions, authoring user, and timestamps.【F:lib/php/data/cases_documents_process.php†L326-L360】

### 1.7 Messages (`cm_messages`)
* Implements threaded messaging with columns for recipients, sender, CC list, subject, body, associated case, sent timestamp, read flags, archive flags, and starred markers.【F:lib/php/data/messages_process.php†L169-L218】

### 1.8 Events and responsibilities (`cm_events`, `cm_events_responsibles`)
* Events capture scheduling data: creator, task title, start/end timestamps (stored both as datetimes and formatted strings), all-day flag, status, notes, location, and creation time.【F:lib/php/data/cases_events_process.php†L75-L151】
* A separate responsibility table links events to the users responsible for them and records when the responsibility was assigned.【F:lib/php/data/cases_events_process.php†L121-L139】

### 1.9 Adverse parties (`cm_adverse_parties`)
* Holds the names of adverse parties for conflict checking. Entries are replaced whenever the case’s adverse party list is updated.【F:lib/php/data/cases_case_data_process.php†L126-L149】

### 1.10 Supporting tables
* `cm_users` maintains user profiles, credentials, group membership, phone numbers, activation status, and security metadata such as private keys and forced password resets.【F:lib/php/users/new_account_process.php†L191-L217】
* `cm_groups` defines role-based permissions and available UI tabs; administrators populate the table to control which features each group can access.【F:documentation/customization.md†L31-L61】
* Lookup tables like `cm_case_types` and `cm_clinic_type` store code-to-label mappings for drop-downs and keep their serialized options synchronized with the column definitions.【F:lib/php/data/utilities_configuration_process.php†L118-L192】

## 2. Front-end template inventory

ClinicCases renders every page through PHP templates under `html/templates`, with `index.php` acting as the front controller that selects and includes the requested view along with shared header, menu, and footer fragments.【F:index.php†L2-L40】

### 2.1 Top-level templates
* **Board.php** – dashboard aggregating board content and widgets, including scripts for board interactions.【F:html/templates/Board.php†L1-L18】
* **Cases.php** – main case list with DataTables setup, context menus, and page-specific scripts.【F:html/templates/Cases.php†L1-L32】
* **Group.php** – supervisory and group management interface with role-specific scripts.【F:html/templates/Group.php†L1-L20】
* **Home.php** – home page combining calendars, activity feeds, and timers.【F:html/templates/Home.php†L1-L20】
* **Journals.php** – journal module template powered by DataTables and rich text editors.【F:html/templates/Journals.php†L1-L19】
* **Login.php** / **Logout.php** – authentication views with login scripts and logout handling.【F:html/templates/Login.php†L2-L20】【F:html/templates/mobile/Logout.php†L1-L14】
* **Messages.php** – system-wide message inbox including tab navigation and message display partials.【F:html/templates/Messages.php†L1-L20】
* **Menus.php** – shared navigation links rendered inside the header on most pages.【F:html/templates/Menus.php†L1-L1】
* **New_Pass.php** – password reset interface that reuses shared timer and timeout components.【F:html/templates/New_Pass.php†L1-L19】
* **Prefs.php** – user preference management forms for profile updates and notification settings.【F:html/templates/Prefs.php†L1-L20】
* **Users.php** – administrative user management dashboard with DataTables integrations.【F:html/templates/Users.php†L1-L20】
* **Utilities.php** – administrative utilities and reports hub with specialized scripts.【F:html/templates/Utilities.php†L2-L20】

### 2.2 Interior (subpage) templates
* **cases_case_data.php** – renders the editable case data panel using the dynamic column configuration.【F:html/templates/interior/cases_case_data.php†L1-L20】
* **cases_casenotes.php** – provides the case notes interface, including search tools and note listings.【F:html/templates/interior/cases_casenotes.php†L1-L20】
* **cases_contacts.php** – contact management UI with search and add-new actions.【F:html/templates/interior/cases_contacts.php†L1-L19】
* **cases_detail.php** – summary header for case detail pages, showing title and assigned users.【F:html/templates/interior/cases_detail.php†L1-L19】
* **cases_documents.php** – document management view toggling between grid and list layouts.【F:html/templates/interior/cases_documents.php†L1-L20】
* **cases_events.php** – case event listing with search and create controls.【F:html/templates/interior/cases_events.php†L1-L18】
* **cases_messages.php** – case-scoped messaging hub and search tools.【F:html/templates/interior/cases_messages.php†L1-L18】
* **board_display.php** – markup for creating and filtering board posts.【F:html/templates/interior/board_display.php†L1-L19】
* **home_activities.php** / **home_upcoming.php** – activity stream and upcoming calendar widgets on the home page.【F:html/templates/interior/home_activities.php†L1-L18】【F:html/templates/interior/home_upcoming.php†L1-L1】
* **messages_display.php** – reusable message composer and thread renderer.【F:html/templates/interior/messages_display.php†L1-L20】
* **timer.php** / **idletimeout.php** – shared UI components for the case timer and session timeout warnings.【F:html/templates/interior/timer.php†L1-L4】【F:html/templates/interior/idletimeout.php†L1-L4】
* **user_detail.php** – modal profile view for individual users within the UI.【F:html/templates/interior/user_detail.php†L1-L18】
* **utilities_configuration.php** – administrative forms for managing case types, clinics, and other configuration data.【F:html/templates/interior/utilities_configuration.php†L1-L18】

### 2.3 Mobile templates
* Mobile templates mirror the desktop experience with responsive Bootstrap layouts under `html/templates/mobile` (e.g., `Board.php`, `Home.php`, `Cases.php`, `Case.php`).【F:html/templates/mobile/Board.php†L1-L19】【F:html/templates/mobile/Cases.php†L1-L20】【F:html/templates/mobile/Case.php†L1-L20】【F:html/templates/mobile/Home.php†L1-L20】
* Additional mobile views cover authentication, messaging, password reset, and quick case intake (`Login.php`, `Messages.php`, `New_Pass.php`, `QuickAdd.php`, etc.).【F:html/templates/mobile/Login.php†L2-L19】【F:html/templates/mobile/Messages.php†L1-L20】【F:html/templates/mobile/New_Pass.php†L2-L19】【F:html/templates/mobile/QuickAdd.php†L1-L19】

## 3. Next.js + PostgreSQL migration blueprint

The following high-level steps outline how to rebuild ClinicCases with a modern React stack while preserving its data and feature set:

1. **Project setup** – Create a new Next.js repository (`npx create-next-app`) and initialize supporting tooling such as TypeScript, ESLint, and Tailwind CSS as needed.
2. **Database provisioning** – Spin up PostgreSQL (Docker or managed service) and define a dedicated database (e.g., `cliniccases_db`). Capture credentials in environment variables.
3. **ORM configuration** – Install Prisma (or your preferred ORM), run `npx prisma init`, and model each ClinicCases table (`Case`, `CaseAssignee`, `CaseNote`, `CaseContact`, `Document`, `Message`, `Event`, `EventResponsible`, `AdverseParty`, `User`, `Group`, etc.) to mirror the MySQL schema documented above. Include relations that reflect foreign keys (e.g., `Case` ↔ `CaseNote`).
4. **Migrations** – Execute `npx prisma migrate dev --name init` (or equivalent) to create the schema in PostgreSQL, adjusting field types to suit Postgres conventions (booleans, timestamps with time zone, JSON where useful for serialized arrays).
5. **API routes** – Implement RESTful or RPC-style handlers under `app/api` (or `pages/api`) for CRUD operations on cases, assignments, notes, contacts, documents, messages, events, and supporting tables. Leverage Prisma client queries for data access.
6. **UI reconstruction** – Map each PHP template to a Next.js page or component. For example, create `/cases` for the case list, nested routes like `/cases/[id]/notes`, a `/dashboard` page for the board view, and `/messages` for inbox functionality. Use modern component libraries to replicate the layouts cataloged in Section 2.
7. **Authentication and authorization** – Integrate NextAuth.js or another auth provider to manage sessions, implement role-based permissions mirroring `cm_groups`, and guard routes/actions accordingly.
8. **Data migration** – Export existing MySQL data and import it into PostgreSQL, transforming serialized arrays or enum fields as necessary to match the new schema.
9. **Testing and iteration** – Validate every workflow (case lifecycle, assignments, notes, documents, messaging, events) against the legacy behavior, iterating on schema and UI refinements as discrepancies are discovered.

By following this blueprint and referencing the schema and template inventory above, you can methodically recreate ClinicCases with a modern stack while maintaining its established data relationships and user experience.
