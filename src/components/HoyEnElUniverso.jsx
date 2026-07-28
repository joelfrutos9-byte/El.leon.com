import { HoyEnElUniverso } from './components/HoyEnElUniverso';
import { TableroMision } from './components/TableroMision';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Tu Navbar actual */}
      
      {/* Tu Hero principal */}

      {/* BLOQUES NUEVOS */}
      <HoyEnElUniverso />
      <TableroMision recaudado={0} objetivo={2600000} />

      {/* Tu sección de Merch / León Store actual */}

      {/* Tu Footer actual */}
    </div>
  );
}

export default App;
