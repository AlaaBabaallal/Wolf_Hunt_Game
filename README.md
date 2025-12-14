Wolf Hunter Game 

C'est un jeu où le loup controlle par le joueur en utilisant les fleches pour parcourir la map essaie de manger tout les moutons avant d'etre rattrape par le chien qui les garde 
Les moutons essaient de rentrer a la grange avant d'etre manges par le loup 

La partie s’arrête immédiatement si le chien  entre en collision avec le loup. Dans ce cas, le joueur perd la partie. Une fin de manche est également déclenchée lorsque l’ensemble des moutons a disparu du terrain, que ce soit par consommation ou par sauvetage. Le score final correspond alors au nombre total de moutons mangés.

Comportements utilises :
Arrival(), AvoidObstacles(), Seek(), flee().

Moutons : 
Les moutons sont entièrement contrôlés par une intelligence artificielle autonome. Ils détectent la présence du loup et cherchent à fuir lorsqu’il s’approche, avant tout contact physique. Leur comportement est orienté vers la grange, qu’ils cherchent à atteindre pour se mettre en sécurité. Ils évitent les obstacles présents sur le terrain, comme les rochers et les buissons. Lorsqu’ils atteignent les limites du terrain, ils rebondissent afin de rester dans la zone de jeu et ne jamais se retrouver bloqués. 

Chien : 
Le chien de berger est une entité contrôlée par une intelligence artificielle agressive. Il poursuit activement le loup dès le début de la partie. Son déplacement est fluide et réaliste, et il évite les obstacles. Le chien représente la principale menace pour le joueur, car un simple contact avec le loup met fin à la partie.

Loup :
Le loup est l’entité contrôlée par le joueur. Il peut se déplacer librement dans la zone de jeu. Lorsqu’il entre en collision avec un mouton, celui-ci disparaît et le score du joueur augmente. Le joueur doit en permanence éviter le chien de berger tout en essayant d’optimiser ses déplacements pour intercepter les moutons avant leur arrivée à la grange.

Obstacles :
Le terrain contient plusieurs obstacles fixes, comme des rochers et des buissons. Ces obstacles influencent les déplacements des différentes entités, qui les évitent automatiquement. Ils participent à la structuration du terrain et obligent le joueur à adapter sa stratégie.

Interface joueur :
Le jeu affiche une interface simple et lisible indiquant le nombre de moutons mangés, le nombre de moutons sauvés et le nombre de moutons restants. Ces informations sont représentées sous forme de jauges dynamiques qui évoluent en temps réel pendant la partie.

Etats de jeu :
Menu : Lorsque le jeu n'a pas encore debute 
Playing : Lorsque le joueur est en train de jouer 
Game over : Lorsque le chien rattrape le loup 
Done : Lorsqu'il n y a pas de moutons restants dans la map. soit les moutons sont manges par le loup ou ils ont pu arrive a la grange ou les deux ( des moutons ont ete manges et des autre ont pu arriver a la grange )
