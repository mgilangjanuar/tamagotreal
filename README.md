<p>
  <a href="https://supabase.io"><img width="155" src="https://raw.githubusercontent.com/supabase/supabase/master/web/static/supabase-light-rounded-corner-background.svg"/></a>  &nbsp;
  <a href="https://vercel.com/?utm_source=restfire-studio&utm_campaign=oss"><img width="190" src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"/></a>
</p>

---

# 🐹 Tamagotreal

Tamagotchi for your real pets. *For kids nowadays*: this is Instagram for your pets 🐹 🐱 🐶

Tamagotreal is live at [tamagotreal.vercel.app](https://tamagotreal.vercel.app)!

<p>
  <img width="200" src="./web/public/photo_2021-08-06&#32;23.56.11.jpeg" />
  <img width="200" src="./web/public/photo_2021-08-06&#32;23.56.30.jpeg" />
  <img width="200" src="./web/public/photo_2021-08-06&#32;23.56.37.jpeg" />
  <img width="200" src="./web/public/photo_2021-08-06&#32;23.56.24.jpeg" />
</p>
<figure class="video_container">
  <iframe src="https://user-images.githubusercontent.com/3146378/128583685-4ec6696d-66c4-43e3-a3d3-826d846e1323.mov" frameborder="0" allowfullscreen="true"> </iframe>
</figure>

This is the open source project of pet social media to expose your cute pet and will be the eyebleach for others. Tamagotreal uses [Supabase](https://supabase.io) to:

 - authenticate user for sign in with 3rd party apps such as Google, Twitter, and GitHub
 - storing data of pets info, feeds, and comments
 - storage to upload the pet's photo

## Upcoming Features

- [x] profile
- [x] feeds
- [x] comment
- [x] like
- [x] auto re-login
- [ ] chat room
- [ ] stories
- [ ] share feed
- [ ] notification
- [ ] view other pet's profile

## Getting Started

#### `yarn install`

Install all dependencies.

#### `yarn api build [-w]`

Build the API service.

Use `-w` to watch all the changes in the development environment.

#### `yarn api start`

Run the API service. Using port 3000 as default.

Run `yarn api node .` to run the service in the production.

#### `[REACT_APP_API_URL=<API_SERVICE_URL>] yarn web start`

Runs the app in the development mode. Press `Y` if it offer you to run the app on another port.

Open http://localhost:3001 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `[REACT_APP_API_URL=<API_SERVICE_URL>] yarn web build`

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Contributing

 0. Like this repo <3
 0. Send an issue
 0. Or, fork and send us a pull request to the `main` branch

## Maintainers

 - mgilangjanuar ([github](https://github.com/mgilangjanuar), [twitter](https://twitter.com/mgilangjanuar))

## License

[MIT](./LICENSE.md)

![high-five](https://media1.giphy.com/media/XZMh13cILjZfhWeEbr/giphy.gif?cid=ecf05e47seb8mxwf85bom4zuq2akc6t5kmjil31qhykhno75&rid=giphy.gif&ct=g)
