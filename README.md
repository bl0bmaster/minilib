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
	8480    minified
	% du -s -b minified/*
    953 miniblog.js
    134 minicommons.js
    265 miniget.js
    414 minilib.js
    1778 minilight.js
    840 minimark.js

## Todo

  * Lire d'autres répertoires que ceux de Apache.
  * doc demo test
  * un vrai build
  * minimark en propre et tant pis pour la taille :/
  * miniblog capable de lire autre chose que readme.md (README.md à minima)
