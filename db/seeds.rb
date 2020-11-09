# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

puts "Cleaning DB..."
Message.destroy_all
SpecialSkill.destroy_all
Character.destroy_all


# puts "Creating characters"

# corto = Character.create!(
#   name: "Corto Maltese",
#   max_life: 22,
#   life: 22,
#   perception: 8,
#   intelligence: 14,
#   dexterite: 10,
#   force: 9,
#   constitution: 11,
#   charisme: 14,
#   chance: 7,
#   inventory: "- Un revolver Colt Peacemaker 6 balles
# - 24 balles de rechange
# - Un sextant, un compas et une boussole pour la navigation
# - Un couteau à cran d'arrêt
# - Une figurine de la légendaire Kraken Palourde que j'ai sculpté moi même
# - Une montre à gousset qui marche plus avec une photo dedans
# - Parchemin de l'ile des Templiers
# "
# )
# albrice = Character.create!(
#   name: "Albrice Montfort",
#   max_life: 14,
#   life: 14,
#   perception: 16,
#   intelligence: 14,
#   dexterite: 13,
#   force: 7,
#   constitution: 7,
#   charisme: 6,
#   chance: 11,
#   inventory: "- Des perles brillantes et lumineuses : au milieu du front, et sur chaque bracelet sur les avant-bras.
# - Un cristal sur le devant de l'abdomen
# - Une cape sombre qui peut cacher mon étrange constitution et quelques objets qui peuvent tenir dans mes bras
# "
# )
# alfonse = Character.create!(
#   name: "Alphonse Lafonce",
#   max_life: 26,
#   life: 26,
#   perception: 14,
#   intelligence: 7,
#   dexterite: 7,
#   force: 12,
#   constitution: 13,
#   charisme: 7,
#   chance: 15,
#   inventory: "- Une vieille pioche qui tire la gueule (elle a voyagé)
# - Du charbon (ça peut toujours servir)
# - Un livre mystérieux que j'ai récupéré sur ma route (dommage que je ne sache pas lire)
# - Un couteau-suisse (le tire-bouchon est un peu usé)
# - Une bouteille d'alcool de couilles de caribou (la légende dit qu'il y a 150% d'alcool, j'ai pas tout compris, en tous cas ça tabasse)
# - Un outil de ma conception sur l'île déserte, sorte de filet de pêche un peu nul (la base est là mais le filet doit être amélioré...)
# - Un sabre
# - Une sacoche avec des baies rouges dedans
# - Une sacoche avec des baies noires dedans
# - Un fusil
# "
# )
# francois = Character.create!(
#   name: "François l'Olonnais",
#   max_life: 16,
#   life: 16,
#   perception: 12,
#   intelligence: 10,
#   dexterite: 13,
#   force: 7,
#   constitution: 8,
#   charisme: 17,
#   chance: 12,
#   inventory: "- sabre
# - vielle roue
# - pistolet
# - plante contre le mal de mer
# - 2 teil de rhum
# - toum
# "
# )

# puts "Creating special skills"

# apaiser = SpecialSkill.create!(
#   name: "Apaiser les coeurs",
#   value: 60,
#   character: alfonse
# )
# courir = SpecialSkill.create!(
#   name: "Courir / Sauter / Grimper",
#   value: 10,
#   skill: "dexterite",
#   character: alfonse
# )
# lire = SpecialSkill.create!(
#   name: "Lire / Écrire",
#   skill: "intelligence",
#   value: 2,
#   character: alfonse
# )
# perle1 = SpecialSkill.create!(
#   name: "Perle 1 : Voir à travers la matière",
#   value: 60,
#   character: albrice
# )
# perle2 = SpecialSkill.create!(
#   name: "Perle 2 : Sentir la magie",
#   value: 60,
#   character: albrice
# )
# perle3 = SpecialSkill.create!(
#   name: "Perle 3 : Comprendre/Parler les langages inconnus",
#   value: 60,
#   character: albrice
# )
# apprendre = SpecialSkill.create!(
#   name: "Apprendre la vie aux gens",
#   value: 60,
#   character: francois
# )
# dressage = SpecialSkill.create!(
#   name: "Dressage",
#   value: 5,
#   skill: "charisme",
#   factor: 2,
#   character: francois
# )
