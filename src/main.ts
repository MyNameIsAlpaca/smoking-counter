import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

console.log('main.ts caricato');

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    console.log('Angular inizializzato correttamente!');
  })
  .catch(err => {
    console.error('Errore durante l’inizializzazione di Angular:', err);
  });

