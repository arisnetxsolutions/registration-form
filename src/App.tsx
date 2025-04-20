import EmbeddableRegistration from "./components/EmbeddableRegistration"
interface AppProps {
  redirectUrl: string;
  signInUrl: string;
}
const App: React.FC<AppProps> = ({ redirectUrl, signInUrl }) => {
  return (
    <div className="app">
      <EmbeddableRegistration redirectUrl={redirectUrl} signInUrl={signInUrl} />
    </div>
  )
}
export default App
