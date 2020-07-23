# Minilib

## À propos
Un jeu de librairies `Javascript` sans intérêt. Pour faire mumuse avec les limites du langage le soir devant la télé.

## Contenu
il y a les mini libs suivantes :

  * la minilib qui sert de glue minimale avec les autres libs.
  * un hilighter qui marche avec **TOUS** les langages de programmation mais en mode best effort (franchement je suis quand même bien content du résultat ;) )
  * un interpreteur markdown
  * un moteur de blog en JS qui parse les répertoires Apache et affiche les articles en mode `Markdown`.
  * un script de build à l'arrache qui juste minifie les js
  
Le tout fait moins de **10ko**. *Qui dit mieux ?*.

	% du -s -b minified
	9287    minified
	% du -s -b minified/*
	953     minified/miniblog.js
	134     minified/minicommons.js
	265     minified/miniget.js
	414     minified/minilib.js
	1918    minified/minilight.js
	1507    minified/minimark.js


## Todo

  * Lire d'autres répertoires que ceux de Apache.
  * doc demo test
  * un vrai build
  * minimark en propre et tant pis pour la taille :/