import './App.css';
import MainHeader from './components/Header';
import Main from './components/Main';
import Login from './login/page';
import Register from './register/page';
import DestinationPage from './destination/page';
import { Route } from "wouter";


import '@fontsource/inter/100.css';
import '@fontsource/inter/200.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';

function Home(){
  return (
    <div>
      <MainHeader/>
      <Main/>
    </div>
  )
}


function App() {
  return (
    <div className="App bg-[#F5F5F5]">
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}></Route>
      <Route path="/destinos/:id" component={DestinationPage} />
    </div>
  );
}

export default App;
