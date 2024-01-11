import './App.css';
import CustomTable from './components/CustomTable';

function App() {
  return (
    <div className="App">
      <CustomTable
        apiLink="https://jsonplaceholder.typicode.com/posts" //api 
        columnWidths={['50px', '50px', '300px']} //column genişlikleri
        columnColors={['lightblue', 'grey', 'white', 'darkgreen']} //column içi arkaplan rengi
        fontColors={['black', 'white', 'black', 'white']} //column içi font rengi
        textAlign={['center', 'center', 'left', 'center']} //column içi text hizalama
        padding={['15px', '15px', '5px', '25px']} //column içi padding
        //centered={true} //datagrid ortalanacak mı? - istediğim gibi çalışmıyor şu an
        divHeight={'600px'} //datagrid yüksekliği
        divWidth={'700px'} //datagrid genişliği
        divPosition={'relative'} //datagrid position
        gridRow={'5 / 6'} //datagrid x axis pozisyonu 
        gridColumn={'5 / 9'} //datagrid y axis pozisyonu
      />
    </div>
  );
}

export default App;