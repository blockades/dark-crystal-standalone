# Dark-Crystal

back up secrets by weaving them into your relationships

```
npm install
npm start
```

## Notes for Devs

- Actions used for executing queries and caching them out of the views. See example in `app/actions/secrets/index/js`.
- Components should be dumb - purely ‘presentational’, their only responsibility is to present something to the DOM.
- Views (also known as containers) need to be able to access the application state (via depject).

- Reducers - should we include these? Some of the filter/reduce we're doing in actions is the role of a reducer. 

```
├── app
│   ├── actions
│   │   └── secrets
│   │       └── fetch.js
│   ├── components
│   │   ├── are-you-sure.js
│   │   ├── copy-to-clipboard.js
│   │   ├── errors.js
│   │   ├── progress-bar.js
│   │   ├── progress-bar.mcss
│   │   ├── recipient.js
│   │   ├── recipient.mcss
│   │   ├── recipients.js
│   │   ├── recipients.mcss
│   │   ├── secret.js
│   │   └── timestamp.js
│   ├── index.js
│   ├── router
│   │   ├── async
│   │   │   ├── normalise.js
│   │   │   └── router.js
│   │   └── sync
│   │       ├── goTo.js
│   │       └── routes.js
│   ├── styles
│   │   └── mcss.js
│   └── views
│       ├── secrets
│       │   ├── index.js
│       │   ├── index.mcss
│       │   ├── show.js
│       │   └── show.mcss
│       └── settings
│           └── index.js
├── assets
│   ├── base.html
│   ├── icon_200x200.png
│   └── icon_660x660.png
├── config.js
├── index.js
├── lib
│   ├── about
│   │   ├── html
│   │   │   ├── avatar.js
│   │   │   └── avatar.mcss
│   │   └── pull
│   │       └── updates.js
│   ├── index.js
│   └── sync
│       ├── initialise
│       │   ├── electronState.js
│       │   ├── errorCatcher.js
│       │   ├── settings.js
│       │   ├── styles.js
│       │   └── suggestionCaches.js
│       └── start.js
├── package.json
├── package-lock.json
├── README.md
├── server.js
└── TODO.md
```
