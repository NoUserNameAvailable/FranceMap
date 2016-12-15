# testmap

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.




select ?donnee ?lat ?long (concat(group_concat(?categorieNom;separator=","))as ?categories)  
where {
?donnee <http://dbpedia.org/ontology/location> ?adresse
{?donnee rdf:type <http://dbpedia.org/ontology/Museum>} UNION {?donnee rdf:type <http://dbpedia.org/ontology/ArchitecturalStructure>}.
{?donnee <http://dbpedia.org/ontology/location> <http://dbpedia.org/resource/Paris>}UNION {?donnee <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:Museums_in_Paris>}
?donnee <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat.
?donnee <http://www.w3.org/2003/01/geo/wgs84_pos#long> ?long.
?donnee <http://purl.org/dc/terms/subject> ?categorie.
?categorie rdfs:label ?categorieNom.
FILTER NOT EXISTS { ?donnee rdf:type <http://dbpedia.org/ontology/ReligiousBuilding> }
}group by ?donnee ?lat ?long 
