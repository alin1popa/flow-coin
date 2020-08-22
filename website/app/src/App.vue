<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400&display=swap" rel="stylesheet">
    <div id="nav">
      <router-link to="/">Trade Flowcoin</router-link> |
      <router-link to="/generate">Get Flowcoin</router-link> |
      <router-link to="/about">About this project</router-link> | 
      <router-link to="/network">Switch network</router-link>
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
  color: #47FFAE;
  font-size: 20px;
}

#nav a {
  font-weight: bold;
  text-decoration: none;
  color: #47FFAE;
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

::-webkit-scrollbar {
    width: 6px;
    margin-right: 5px;
}
 
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4); 
    -webkit-border-radius: 10px;
    border-radius: 10px;
}
 
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.5); 
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}
</style>
