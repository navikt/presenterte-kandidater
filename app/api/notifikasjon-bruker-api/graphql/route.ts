import { NotifikasjonAPI } from '../../api-routes';
import { proxyWithOBO } from '../../oboProxy';

export async function GET(request: Request) {
  return proxyWithOBO(NotifikasjonAPI, request);
}

export async function POST(request: Request) {
  return proxyWithOBO(NotifikasjonAPI, request);
}
