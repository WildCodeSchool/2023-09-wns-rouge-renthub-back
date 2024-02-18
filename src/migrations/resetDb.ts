import { MigrationInterface, QueryRunner } from 'typeorm'

export class init implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insérer les données dans la table category
    await queryRunner.query(`
       INSERT INTO category (name, "index", display, "createdBy", "createdAt")
       VALUES 
           ('Raquettes', 1, true, 'admin', NOW()),
           ('Ballons', 2, true, 'admin', NOW()),
           ('Équipement de protection', 3, true, 'admin', NOW()),
           ('Équipement de natation', 4, true, 'admin', NOW())
   `)

    // Insérer les sous-catégories pour les raquettes
    await queryRunner.query(`
       INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
       VALUES 
           ('Raquettes de tennis', 1, true, 'admin', NOW(), 1),
           ('Raquettes de badminton', 2, true, 'admin', NOW(), 1),
           ('Raquettes de squash', 3, true, 'admin', NOW(), 1)
   `)

    // Insérer les sous-catégories pour les ballons
    await queryRunner.query(`
       INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
       VALUES 
           ('Ballons de football', 1, true, 'admin', NOW(), 2),
           ('Ballons de basketball', 2, true, 'admin', NOW(), 2),
           ('Ballons de volleyball', 3, true, 'admin', NOW(), 2),
           ('Ballons de rugby', 4, true, 'admin', NOW(), 2)
   `)

    // Insérer les sous-catégories pour l'équipement de protection
    await queryRunner.query(`
       INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
       VALUES 
           ('Casques', 1, true, 'admin', NOW(), 3),
           ('Protections pour les genoux', 2, true, 'admin', NOW(), 3),
           ('Protections pour les coudes', 3, true, 'admin', NOW(), 3),
           ('Protections pour les poignets', 4, true, 'admin', NOW(), 3)
   `)

    // Insérer les sous-catégories pour l'équipement de natation
    await queryRunner.query(`
       INSERT INTO category (name, "index", display, "createdBy", "createdAt", "parentCategoryId")
       VALUES 
           ('Maillots de bain', 1, true, 'admin', NOW(), 4),
           ('Lunettes de natation', 2, true, 'admin', NOW(), 4),
           ('Bonnet de bain', 3, true, 'admin', NOW(), 4),
           ('Planches de natation', 4, true, 'admin', NOW(), 4)
   `)

    // Insérer des données fictives dans la table picture
    await queryRunner.query(`
       INSERT INTO picture (filename, "createdBy", "urlHD", "urlMiniature")
       VALUES 
           ('surfboard.jpg', 'admin', 'http://example.com/images/surfboard_hd.jpg', 'http://example.com/images/surfboard_thumb.jpg'),
           ('ski.jpg', 'admin', 'http://example.com/images/ski_hd.jpg', 'http://example.com/images/ski_thumb.jpg'),
           ('bicycle.jpg', 'admin', 'http://example.com/images/bicycle_hd.jpg', 'http://example.com/images/bicycle_thumb.jpg'),
           ('hiking_boots.jpg', 'admin', 'http://example.com/images/hiking_boots_hd.jpg', 'http://example.com/images/hiking_boots_thumb.jpg')
   `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM category')
  }
}
