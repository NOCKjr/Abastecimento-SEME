import { useNavigate } from 'react-router-dom';
import DynamicForm from "../../../components/DynamicForm";
import { secretariaFormSchema } from "../../../forms/secretaria.schema";
import { createSecretaria } from "../../../api/client";

export default function NovaSecretariaPage() {
  const navigate = useNavigate();

  async function handleSubmit(data: any) {
    try {
      // 1. Executa a chamada à API
      await createSecretaria(data);

      // 2. Notifica o usuário
      alert("Secretaria criada com sucesso!");

      // 3. Navega para a rota de listagem de secretarias
      navigate('/cadastros/secretarias'); 
      
    } catch (error) {
      console.error("Erro ao criar secretaria:", error);
      alert("Ocorreu um erro ao salvar os dados.");
    }
  }

  return (
    <div>
      <h2>Nova Secretaria</h2>
      <DynamicForm
        schema={secretariaFormSchema}
        onSubmit={handleSubmit}
      />
    </div>
  );
}