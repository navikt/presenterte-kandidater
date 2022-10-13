import { useParams, Link } from "@remix-run/react";
import { Heading } from "@navikt/ds-react";

const Kandidat = () => {
    const { kandidatlisteId, kandidatId } = useParams();

    return (
        <main className="side">
            <Link to={`/kandidatliste/${kandidatlisteId}`}>Tilbake</Link>
            <Heading size="medium">
                Kandidat {kandidatId} i kandidatliste {kandidatlisteId}
            </Heading>
        </main>
    );
};

export default Kandidat;
