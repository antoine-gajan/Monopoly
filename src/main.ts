import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/*
Après avoir regardé d'autres tutos sur le lien entre MongoDB et Angular, je me suis aperçu qu'ils me parlaient tous du fichier mongodb.conf mais je ne le trouve pas. Une fois qu'on l'a, il faudra modifier les IPs autorisées à se connecter (https://stackoverflow.com/questions/39375971/how-to-connect-to-mongodb-on-remote-server-from-angular-spring-application-hoste) puis enfin ajouter le fichier server.js au projet (https://hevodata.com/learn/angular-mongodb/).
 */
