

-- 1. Table Agent (La racine de ton diagramme)
CREATE TABLE agent_marketing (
                                 id SERIAL PRIMARY KEY,
                                 name VARCHAR(255),
                                 type VARCHAR(50)
);

-- 2. Table Contact (Pour ta sidebar)
CREATE TABLE contact (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(255),
                         channel VARCHAR(50),
                         last_msg VARCHAR(255),
                         online BOOLEAN
);

-- 3. Table Discussion (Lien entre Agent et Contact)
CREATE TABLE discussion (
                            id SERIAL PRIMARY KEY,
                            status VARCHAR(50),
                            created_at TIMESTAMP,
                            agent_id INTEGER REFERENCES agent_marketing(id),
                            contact_id INTEGER REFERENCES contact(id)
);

-- 4. Table Message
CREATE TABLE message (
                         id SERIAL PRIMARY KEY,
                         content TEXT,
                         timestamp TIMESTAMP,
                         sender VARCHAR(255),
                         discussion_id INTEGER REFERENCES discussion(id)
);

-- INSERTION DE DONNÉES POUR TON FRONTEND
INSERT INTO agent_marketing (name, type) VALUES ('Système Snappy', 'AI');

INSERT INTO contact (name, channel, last_msg, online)
VALUES ('Sarah (Marketing)', 'Human', 'On peut valider la maquette ?', true);

INSERT INTO discussion (status, created_at, agent_id, contact_id)
SELECT 'ACTIVE', NOW(), 1, id FROM contact WHERE name = 'Sarah (Marketing)';