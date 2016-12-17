# testmap

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.



requete fin map
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


https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=select+%3Fphoto+%3Fnom+%3Fresume+%3Fsite+%3Fwiki+where+%7B%0D%0AOPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FTemple_%28Paris%29%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fphoto%7D.%0D%0AOPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FTemple_%28Paris%29%3E+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fnom%7D.%0D%0AOPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FTemple_%28Paris%29%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fabstract%3E+%3Fresume%7D.%0D%0AOPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FTemple_%28Paris%29%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2Fwebsite%3E+%3Fsite%7D.%0D%0AOPTIONAL+%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FTemple_%28Paris%29%3E+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2FisPrimaryTopicOf%3E+%3Fwiki%7D.%0D%0Afilter%28langMatches%28lang%28%3Fnom%29%2C%22fr%22%29%29.%0D%0Afilter%28langMatches%28lang%28%3Fresume%29%2C%22fr%22%29%29%0D%0A%7D&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on




requete pour une donnée precice (fin)
select ?photo ?nom ?resume ?site ?wiki where {
OPTIONAL {<http://dbpedia.org/resource/Temple_(Paris)> <http://dbpedia.org/ontology/thumbnail> ?photo}.
OPTIONAL {<http://dbpedia.org/resource/Temple_(Paris)> <http://www.w3.org/2000/01/rdf-schema#label> ?nom}.
OPTIONAL {<http://dbpedia.org/resource/Temple_(Paris)> <http://dbpedia.org/ontology/abstract> ?resume}.
OPTIONAL {<http://dbpedia.org/resource/Temple_(Paris)> <http://dbpedia.org/property/website> ?site}.
OPTIONAL {<http://dbpedia.org/resource/Temple_(Paris)> <http://xmlns.com/foaf/0.1/isPrimaryTopicOf> ?wiki}.
filter(langMatches(lang(?nom),"fr")).
filter(langMatches(lang(?resume),"fr"))
}
