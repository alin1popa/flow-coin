<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400&display=swap" rel="stylesheet">
    <div id="nav">
      <router-link to="/">Trade Flowcoin</router-link> |
      <router-link to="/about">Get Flowcoin</router-link> |
      <router-link to="/about">About this website</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style src="flexboxgrid/dist/flexboxgrid.min.css"></style>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
#nav {
  padding: 5px;
  padding-top: 0;
  height: 20px;
  color: #42b983;
  font-size: 20px;
}

#nav a {
  font-weight: bold;
  text-decoration: none;
  color: #42b983;
}

#nav a.router-link-exact-active {
  color: #41D8E8;
  text-decoration: underline;
}

html,body {
  padding-left: 5px;
  padding-right: 5px;
  background-color: #313132;
}
</style>
