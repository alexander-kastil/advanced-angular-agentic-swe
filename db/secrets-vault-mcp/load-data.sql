-- secrets-vault-mcp seed data, SQLite dialect. Applied once, immediately after
-- create-schema.sql, when the database file is absent on startup.

PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO Roles (RoleId, Name) VALUES
    ('59ddd16d-b909-4cd1-8a22-7a503bd538ef', 'Owner'),
    ('a0f4446e-d821-4db2-af26-c2a668a8cbfe', 'Customer');

INSERT OR IGNORE INTO Users (UserId, Name, PasswordHash, IsActive, CreatedAt) VALUES
    ('8ed5ff72-2c23-4ce7-bf9d-f0407d5f6118', 'owner', '$2a$11$7DaLHMV3Y1UiEEI6iuGC4OXe5EyLsxbssl84TnEW3G9c4S63rxzya', 1, '2026-01-01T00:00:00.0000000Z'),
    ('2b164456-9afc-4eb9-9d0d-2a250aac9f52', 'customer', '$2a$11$zvc.szGo5BAtaLe61B8rWuo.0c3E0jdXDi2vMeAL/Rv24O/7x9hZe', 1, '2026-01-01T00:00:00.0000000Z');

INSERT OR IGNORE INTO UserRoles (UserId, RoleId) VALUES
    ('8ed5ff72-2c23-4ce7-bf9d-f0407d5f6118', '59ddd16d-b909-4cd1-8a22-7a503bd538ef'),
    ('2b164456-9afc-4eb9-9d0d-2a250aac9f52', 'a0f4446e-d821-4db2-af26-c2a668a8cbfe');

INSERT OR IGNORE INTO SecretLists (ListId, Name, Description, Type) VALUES
    ('2df6e6fc-7914-4d51-811d-8c9242fc6e52', 'Training Logins', 'Login credentials used throughout the Angular training labs.', 1),
    ('e12d7379-3833-48d3-9df2-bc8f47fbe58e', 'CI/CD Credentials', 'Tokens and keys used by pipelines and deployment scripts.', 1),
    ('2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1', 'Cloud Provider Keys', 'API keys for the cloud providers used across the demos.', 1),
    ('a9794369-8836-4b9f-a22f-550e15be6167', 'Team Documents', 'Small reference files the team keeps close at hand.', 2),
    ('e59dda4f-874c-47b3-9f7d-78c63f28a678', 'Deployment Certificates', 'Certificates and key files used when deploying labs.', 2);

INSERT OR IGNORE INTO Categories (CategoryId, Topic, Color, ListId) VALUES
    ('cf6a7e9d-d925-482b-8df6-3887f62f15cc', 'Students', '#3B82F6', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('46e794e9-84bc-4b07-9b51-63de9183c68d', 'Instructors', '#F59E0B', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('cbb6772f-bdba-4ba6-9537-ef9d7b9ef45c', 'Demo Apps', '#10B981', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('b4c63e03-4f47-46d0-a980-1518326e1973', 'GitHub Actions', '#6366F1', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('a82e47e4-0181-486f-bb93-c9321ed0a1f7', 'Docker Registry', '#0EA5E9', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('a689b48a-d1b2-4fe0-a0ff-750a67a3c6b3', 'Azure', '#0078D4', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('fb5193ce-e1ae-416c-9822-a254ce93e2ef', 'Hetzner', '#D50C2D', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('cf56a853-9bb5-4bc3-addd-1402588ec19d', 'DeepInfra', '#8B5CF6', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('cad9bd15-c69e-4082-819b-f04cbe83f31b', 'Onboarding', '#22C55E', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('2035873b-0e8d-48da-b7f3-ceba21ab3cf3', 'Reference', '#64748B', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('458c0222-7d70-4fd1-a17b-fdd69216272f', 'Production', '#EF4444', 'e59dda4f-874c-47b3-9f7d-78c63f28a678'),
    ('d68f1077-f9f9-4e00-a667-254230723e12', 'Staging', '#F97316', 'e59dda4f-874c-47b3-9f7d-78c63f28a678');

-- 35 secret rows across 5 lists
INSERT OR IGNORE INTO Secrets (SecretId, Name, Url, User, Comment, Mfa, Version, LastChanged, ListId) VALUES
    ('c93552a1-3891-4924-9526-d878bd1a00e7', 'student-portal', 'https://learn.integrations.at', 'student01', 'Shared student login for the labs.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('a4dbcb8d-0fdf-435c-bfc1-f3ca5f3ad7b6', 'instructor-console', 'https://learn.integrations.at/admin', 'instructor', 'Instructor-only console access.', 1, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('7f3d651a-bf69-42bc-ae3d-57ea175701b3', 'demo-app-owner', 'https://secrets-vault.local', 'owner', 'Owner account for the secrets-vault-mcp demo.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('66836204-712c-41b0-aed1-5c2f1fbaea0c', 'demo-app-customer', 'https://secrets-vault.local', 'customer', 'Customer account for the secrets-vault-mcp demo.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('3f2e0b28-4c37-4dcc-a3c9-12cf07cbaf4c', 'lab-wifi', NULL, 'training-room', 'Classroom Wi-Fi network password.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('863e243b-292d-48aa-8d0b-1cd2b8fa03a7', 'student-portal-backup', 'https://learn.integrations.at', 'student01-backup', 'Backup login, rotated each cohort.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('90dba4bc-a0fe-4daf-8039-48047af4bec3', 'student-portal-backup', 'https://learn.integrations.at', 'student01-backup', 'Backup login, rotated each cohort.', 0, 2, '2026-09-05T14:30:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('1acba6e9-3c75-4039-8608-dd0b29b40e73', 'instructor-console', 'https://learn.integrations.at/admin', 'instructor', 'Instructor-only console access.', 1, 2, '2026-09-05T14:30:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('93e82733-955a-42dd-92e2-d4e857b32ad6', 'instructor-console', 'https://learn.integrations.at/admin', 'instructor', 'Instructor-only console access.', 1, 3, '2026-09-08T08:15:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('54b30d2c-d68e-4b30-9413-fd6d958ad961', 'grading-service', 'https://grading.integrations.at', 'grader', 'Service account for automated grading.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2df6e6fc-7914-4d51-811d-8c9242fc6e52'),
    ('51d150d3-e3c2-47d6-a574-944ad73bb6dd', 'github-actions-pat', 'https://github.com', 'ci-bot', 'Fine-grained PAT used by workflow runs.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('af48b909-9104-44af-86b3-1a5e8442d329', 'ghcr-pull-token', 'https://ghcr.io', 'ci-bot', 'Pull-only token for the container registry.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('20ca3387-d644-4c09-936a-5a98f056ffdb', 'ghcr-push-token', 'https://ghcr.io', 'release-bot', 'Push token used only by release jobs.', 1, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('8adc1cbf-7f62-468f-9d0e-00315f250fae', 'deploy-webhook-secret', NULL, NULL, 'Validates inbound deploy webhooks.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('d3bb7779-f813-49bc-b14b-e246492e4a99', 'npm-publish-token', 'https://registry.npmjs.org', 'publisher', 'Publishes course packages when needed.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('429ffa62-3e93-4794-9827-d400fc580c88', 'ghcr-push-token', 'https://ghcr.io', 'release-bot', 'Push token used only by release jobs.', 1, 2, '2026-09-05T14:30:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('ed167e19-14e1-4a6b-b22e-efb3d1ab64a4', 'sonar-scanner-token', 'https://sonarcloud.io', 'ci-bot', 'Static analysis reporting token.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e12d7379-3833-48d3-9df2-bc8f47fbe58e'),
    ('88dfd679-f787-4e3d-84ce-e306e7dcbdab', 'azure-subscription-key', 'https://portal.azure.com', NULL, 'Used by the deployment labs against Azure.', 1, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('5198a581-4a04-4bde-beba-6b0c7a0495ee', 'hetzner-api-token', 'https://console.hetzner.cloud', NULL, 'Provisions the training VPS boxes.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('2d0da1c9-36b7-4c0c-8e27-d006eabe1917', 'hetzner-dns-token', 'https://dns.hetzner.com', NULL, 'Manages DNS zones for the lab domains.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('708b0ea0-ac24-43c9-9ceb-d2a61ee8d0ae', 'deepinfra-api-key', 'https://api.deepinfra.com', NULL, 'Used by the AI-generation demos.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('8a9f2094-82be-4b7f-b4ba-16c9e4566e2c', 'deepinfra-api-key', 'https://api.deepinfra.com', NULL, 'Used by the AI-generation demos.', 0, 2, '2026-09-05T14:30:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('2c8c0938-dd2e-4f73-b2e9-f0431c4a7178', 'azure-storage-connection', NULL, NULL, 'Blob storage used by a couple of demo apps.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('62068d1b-426c-4d2c-b11e-02ec3272731f', 'github-oauth-client-secret', 'https://github.com/settings/developers', NULL, 'OAuth app used by the GitHub-login demo.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('298b3e80-be74-4019-8ce0-46762562b132', 'openai-compatible-key', 'https://api.deepinfra.com/v1/openai', NULL, 'OpenAI-compatible key for the chat demos.', 0, 1, '2026-09-01T09:00:00.0000000Z', '2b6344c5-8d55-4d4a-a1e8-e5efdeca60f1'),
    ('9a02ec98-c8d6-4693-9817-5c2eded20ceb', 'onboarding-checklist', NULL, NULL, 'Checklist handed to new students on day one.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('221ee633-fdc7-4a5b-a64e-64395cfd1d94', 'lab-environment-notes', NULL, NULL, 'Notes on setting up the local lab environment.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('3dadf2a3-4c08-4119-92e4-12ad51aa7753', 'architecture-overview', NULL, NULL, 'One-pager describing the demo app architecture.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('714eaf3a-e7c9-4212-ad0b-bd930f172fa1', 'faq', NULL, NULL, 'Frequently asked questions, first draft.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('3203db62-fc43-41fb-aed1-c4832f9a3563', 'faq', NULL, NULL, 'Frequently asked questions, revised after cohort feedback.', 0, 2, '2026-09-05T14:30:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('f7c8ac9d-72d6-47ce-88a4-02bd89de4f62', 'glossary', NULL, NULL, 'Glossary of terms used across the labs.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'a9794369-8836-4b9f-a22f-550e15be6167'),
    ('1cfe8910-45fa-4a76-8394-a4a53175d01c', 'staging-tls-cert', NULL, NULL, 'Self-signed certificate for the staging slot.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e59dda4f-874c-47b3-9f7d-78c63f28a678'),
    ('9474c2a7-753e-49ea-92e3-074901edb13d', 'production-tls-cert', NULL, NULL, 'Certificate bundle for the production slot.', 1, 1, '2026-09-01T09:00:00.0000000Z', 'e59dda4f-874c-47b3-9f7d-78c63f28a678'),
    ('1d21fa46-a11b-473c-a974-f7f460870c07', 'production-tls-cert', NULL, NULL, 'Renewed certificate bundle for the production slot.', 1, 2, '2026-09-05T14:30:00.0000000Z', 'e59dda4f-874c-47b3-9f7d-78c63f28a678'),
    ('82b3eb4c-8dbe-4062-bd64-64ced9546b97', 'ssh-known-hosts', NULL, NULL, 'known_hosts file for the training VPS boxes.', 0, 1, '2026-09-01T09:00:00.0000000Z', 'e59dda4f-874c-47b3-9f7d-78c63f28a678');

INSERT OR IGNORE INTO SecretCategories (SecretId, CategoryId) VALUES
    ('c93552a1-3891-4924-9526-d878bd1a00e7', 'cf6a7e9d-d925-482b-8df6-3887f62f15cc'),
    ('a4dbcb8d-0fdf-435c-bfc1-f3ca5f3ad7b6', '46e794e9-84bc-4b07-9b51-63de9183c68d'),
    ('7f3d651a-bf69-42bc-ae3d-57ea175701b3', 'cbb6772f-bdba-4ba6-9537-ef9d7b9ef45c'),
    ('66836204-712c-41b0-aed1-5c2f1fbaea0c', 'cbb6772f-bdba-4ba6-9537-ef9d7b9ef45c'),
    ('3f2e0b28-4c37-4dcc-a3c9-12cf07cbaf4c', 'cf6a7e9d-d925-482b-8df6-3887f62f15cc'),
    ('863e243b-292d-48aa-8d0b-1cd2b8fa03a7', 'cf6a7e9d-d925-482b-8df6-3887f62f15cc'),
    ('90dba4bc-a0fe-4daf-8039-48047af4bec3', 'cf6a7e9d-d925-482b-8df6-3887f62f15cc'),
    ('1acba6e9-3c75-4039-8608-dd0b29b40e73', '46e794e9-84bc-4b07-9b51-63de9183c68d'),
    ('93e82733-955a-42dd-92e2-d4e857b32ad6', '46e794e9-84bc-4b07-9b51-63de9183c68d'),
    ('54b30d2c-d68e-4b30-9413-fd6d958ad961', '46e794e9-84bc-4b07-9b51-63de9183c68d'),
    ('54b30d2c-d68e-4b30-9413-fd6d958ad961', 'cbb6772f-bdba-4ba6-9537-ef9d7b9ef45c'),
    ('51d150d3-e3c2-47d6-a574-944ad73bb6dd', 'b4c63e03-4f47-46d0-a980-1518326e1973'),
    ('af48b909-9104-44af-86b3-1a5e8442d329', 'a82e47e4-0181-486f-bb93-c9321ed0a1f7'),
    ('20ca3387-d644-4c09-936a-5a98f056ffdb', 'a82e47e4-0181-486f-bb93-c9321ed0a1f7'),
    ('8adc1cbf-7f62-468f-9d0e-00315f250fae', 'b4c63e03-4f47-46d0-a980-1518326e1973'),
    ('d3bb7779-f813-49bc-b14b-e246492e4a99', 'b4c63e03-4f47-46d0-a980-1518326e1973'),
    ('429ffa62-3e93-4794-9827-d400fc580c88', 'a82e47e4-0181-486f-bb93-c9321ed0a1f7'),
    ('ed167e19-14e1-4a6b-b22e-efb3d1ab64a4', 'b4c63e03-4f47-46d0-a980-1518326e1973'),
    ('88dfd679-f787-4e3d-84ce-e306e7dcbdab', 'a689b48a-d1b2-4fe0-a0ff-750a67a3c6b3'),
    ('5198a581-4a04-4bde-beba-6b0c7a0495ee', 'fb5193ce-e1ae-416c-9822-a254ce93e2ef'),
    ('2d0da1c9-36b7-4c0c-8e27-d006eabe1917', 'fb5193ce-e1ae-416c-9822-a254ce93e2ef'),
    ('708b0ea0-ac24-43c9-9ceb-d2a61ee8d0ae', 'cf56a853-9bb5-4bc3-addd-1402588ec19d'),
    ('8a9f2094-82be-4b7f-b4ba-16c9e4566e2c', 'cf56a853-9bb5-4bc3-addd-1402588ec19d'),
    ('2c8c0938-dd2e-4f73-b2e9-f0431c4a7178', 'a689b48a-d1b2-4fe0-a0ff-750a67a3c6b3'),
    ('62068d1b-426c-4d2c-b11e-02ec3272731f', 'a689b48a-d1b2-4fe0-a0ff-750a67a3c6b3'),
    ('298b3e80-be74-4019-8ce0-46762562b132', 'cf56a853-9bb5-4bc3-addd-1402588ec19d'),
    ('9a02ec98-c8d6-4693-9817-5c2eded20ceb', 'cad9bd15-c69e-4082-819b-f04cbe83f31b'),
    ('221ee633-fdc7-4a5b-a64e-64395cfd1d94', '2035873b-0e8d-48da-b7f3-ceba21ab3cf3'),
    ('3dadf2a3-4c08-4119-92e4-12ad51aa7753', '2035873b-0e8d-48da-b7f3-ceba21ab3cf3'),
    ('714eaf3a-e7c9-4212-ad0b-bd930f172fa1', 'cad9bd15-c69e-4082-819b-f04cbe83f31b'),
    ('3203db62-fc43-41fb-aed1-c4832f9a3563', 'cad9bd15-c69e-4082-819b-f04cbe83f31b'),
    ('f7c8ac9d-72d6-47ce-88a4-02bd89de4f62', '2035873b-0e8d-48da-b7f3-ceba21ab3cf3'),
    ('1cfe8910-45fa-4a76-8394-a4a53175d01c', 'd68f1077-f9f9-4e00-a667-254230723e12'),
    ('9474c2a7-753e-49ea-92e3-074901edb13d', '458c0222-7d70-4fd1-a17b-fdd69216272f'),
    ('1d21fa46-a11b-473c-a974-f7f460870c07', '458c0222-7d70-4fd1-a17b-fdd69216272f'),
    ('82b3eb4c-8dbe-4062-bd64-64ced9546b97', 'd68f1077-f9f9-4e00-a667-254230723e12'),
    ('82b3eb4c-8dbe-4062-bd64-64ced9546b97', '458c0222-7d70-4fd1-a17b-fdd69216272f');

INSERT OR IGNORE INTO VaultFiles (SecretId, FileName, ContentType, ByteSize, Content, UploadedAt) VALUES
    ('9a02ec98-c8d6-4693-9817-5c2eded20ceb', 'onboarding-checklist.txt', 'text/plain', 68, X'312E20436C6F6E6520746865207265706F0A322E20496E7374616C6C204E6F646520616E64202E4E45540A332E2052756E20746865206C61627320696E206F726465720A', '2026-09-01T09:00:00.0000000Z'),
    ('221ee633-fdc7-4a5b-a64e-64395cfd1d94', 'lab-environment-notes.md', 'text/markdown', 49, X'23204C616220656E7669726F6E6D656E740A0A557365204E6F64652032322B20616E64202E4E45542031302053444B2E0A', '2026-09-01T09:00:00.0000000Z'),
    ('3dadf2a3-4c08-4119-92e4-12ad51aa7753', 'architecture-overview.md', 'text/markdown', 75, X'23204172636869746563747572650A0A416E67756C6172205350412074616C6B7320746F2074686520736563726574732D7661756C742D6D637020415049206F7665722048545450532E0A', '2026-09-01T09:00:00.0000000Z'),
    ('3203db62-fc43-41fb-aed1-c4832f9a3563', 'faq.md', 'text/markdown', 83, X'23204641510A0A513A20576865726520646F2073656372657473206C6976653F0A413A20496E207468652053514C6974652066696C65207368697070656420776974682074686520636F6E7461696E65722E0A', '2026-09-05T14:30:00.0000000Z'),
    ('f7c8ac9d-72d6-47ce-88a4-02bd89de4f62', 'glossary.md', 'text/markdown', 41, X'2320476C6F73736172790A0A4D43503A204D6F64656C20436F6E746578742050726F746F636F6C2E0A', '2026-09-01T09:00:00.0000000Z'),
    ('1cfe8910-45fa-4a76-8394-a4a53175d01c', 'staging.pem', 'application/x-pem-file', 74, X'2D2D2D2D2D424547494E2043455254494649434154452D2D2D2D2D0A53544147494E472D504C414345484F4C4445520A2D2D2D2D2D454E442043455254494649434154452D2D2D2D2D0A', '2026-09-01T09:00:00.0000000Z'),
    ('1d21fa46-a11b-473c-a974-f7f460870c07', 'production.pem', 'application/x-pem-file', 77, X'2D2D2D2D2D424547494E2043455254494649434154452D2D2D2D2D0A50524F44554354494F4E2D504C414345484F4C4445520A2D2D2D2D2D454E442043455254494649434154452D2D2D2D2D0A', '2026-09-05T14:30:00.0000000Z'),
    ('82b3eb4c-8dbe-4062-bd64-64ced9546b97', 'known_hosts', 'text/plain', 54, X'6C61622D626F782D312E696E746567726174696F6E732E6174207373682D656432353531392041414141504C414345484F4C4445520A', '2026-09-01T09:00:00.0000000Z');

