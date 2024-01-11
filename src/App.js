import './App.css';
import CustomTable from './components/CustomTable';

function App() {
  return (
    <div className="App">

      <CustomTable
        apiLink="https://jsonplaceholder.typicode.com/posts"
        columnWidths={['50px', '50px', '300px', '600px']}
        columnNames={['USERID', 'ID', 'TITLE', 'BODY']}
        columnColors={[' #581845', 'grey', 'white', '#ff7b5f']}
        fontColors={['black', 'white', 'black', 'white']}
        textAlign={['center', 'center', 'left', 'center']}
        padding={['15px', '15px', '5px', '25px']}
        divHeight={'600px'}
        divWidth={'1000px'}
        divPosition={'relative'}
        gridRow={'5 / 6'} 
        gridColumn={'4 / 9'}
      />
    </div>
  );
}

export default App;