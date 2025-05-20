"use client";
import { useState } from "react";

export default function Home() {
  const baseUrl = "https://back-end-historiaia-five.vercel.app";

  const [titulo, setTitulo] = useState<string>("");
  const [vilao, setVilao] = useState<string>("");
  const [coadjuvante, setCoadjuvante] = useState<string>("");
  const [protagonista, setProtagonista] = useState<string>("");
  const [isLoading, setInLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historiaGerada, setHistoriaGerada] = useState<string | null>(null); // Este estado vai guardar o HTML completo

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInLoading(true);
    setHistoriaGerada(null); // Limpa a história anterior ao submeter
    setError(null); // Limpa erros anteriores

    if (!titulo || !vilao || !coadjuvante || !protagonista) {
      setInLoading(false);
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const data = {
        elementos: [protagonista, vilao, coadjuvante, titulo],
      };

      const response = await fetch(`${baseUrl}/historia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Verifica se a resposta da API não foi bem-sucedida (status 4xx ou 5xx)
      if (!response.ok) {
        const errorData = await response.json();
        // Sua API Flask retorna a mensagem de erro sob a chave 'erro'
        throw new Error(errorData.erro || "Erro desconhecido ao gerar a história na API.");
      }

      // Se a resposta foi bem-sucedida, parseia o JSON
      const responseData = await response.json();
      console.log("Resposta da API:", responseData);

      // Sua API retorna o HTML como uma string diretamente na resposta (não como um objeto com chaves 'historia' ou 'titulo')
      setHistoriaGerada(responseData); // Atribui a string HTML diretamente ao estado

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro desconhecido ao enviar a requisição.");
      }
      console.error("Erro na requisição ou na resposta:", error);
    } finally {
      setInLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Gerar História com IA</h1>

        <div className="mb-4">
          <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo} // Bom ter isso para controle completo do input
            onChange={(e) => setTitulo(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: A Grande Jornada"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="protagonista" className="block text-gray-700 text-sm font-bold mb-2">Protagonista:</label>
          <input
            type="text"
            id="protagonista"
            value={protagonista}
            onChange={(e) => setProtagonista(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Arthur"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="coadjuvante" className="block text-gray-700 text-sm font-bold mb-2">Coadjuvante:</label>
          <input
            type="text"
            id="coadjuvante"
            value={coadjuvante}
            onChange={(e) => setCoadjuvante(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Merlin"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="vilao" className="block text-gray-700 text-sm font-bold mb-2">Vilão:</label>
          <input
            type="text"
            id="vilao"
            value={vilao}
            onChange={(e) => setVilao(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Morgana"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Gerando História...
            </span>
          ) : (
            "Gerar História"
          )}
        </button>
      </form>

      {/* Área para exibir mensagens de erro */}
      {error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md w-full max-w-md text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Área para exibir a história gerada */}
      {historiaGerada && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md w-full max-w-2xl text-gray-800">
          <h2 className="text-xl font-bold mb-4 text-center">Sua História Gerada:</h2>
          {/* A chave aqui é usar dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: historiaGerada }} className="prose max-w-none" />
        </div>
      )}
    </main>
  );
}
