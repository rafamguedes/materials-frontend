import './Loading.css';

export function Loading() {
  return (
    <div className="container-spinner">
        <div className="spinner"></div>
        <h1>Carregando...</h1>
    </div>
  );
}