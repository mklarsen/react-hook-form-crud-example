import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { domainEntrieService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [entries, setDomainEntrie] = useState(null);

    useEffect(() => {
        domainEntrieService.getAll().then(x => setDomainEntrie(x));
    }, []);

    function deleteDomainEntrie(id) {
        setDomainEntrie(entries.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        domainEntrieService.delete(id).then(() => {
            setDomainEntrie(entries => entries.filter(x => x.id !== id));
        });
    }

    // prepared for zone entries
    function editDomainEntrie(id) {
        setDomainEntrie(entries.map(x => {
            if (x.id === id) { x.isEditing = true; }
            return x;
        }));
        // domainService.delete(id).then(() => {
        //     setDomains(domains => domains.filter(x => x.id !== id));
        // });
        //console.log(id);
    }

    return (
        <div>
            <h1>Domain Entries</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add record</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '3%' }}>id</th>
                        <th style={{ width: '20%' }}>Domain</th>
                        <th style={{ width: '10%' }}>Name</th>
                        <th style={{ width: '10%' }}>TTL</th>
                        <th style={{ width: '10%' }}>TYPE</th>
                        <th style={{ width: '10%' }}>record</th>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {entries && entries.map(entrie =>
                        <tr key={entrie.id}>

                            <td>{entrie.id}</td>
                            <td>{entrie.domain}</td>
                            <td>{entrie.name}</td>
                            <td>{entrie.ttl}</td>
                            <td>{entrie.type}</td>
                            <td>{entrie.record}</td>
                            
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${entrie.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteDomain(entrie.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={entrie.isDeleting}>
                                    {entrie.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>

                            </td>
                        </tr>
                    )}
                    {!entries &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {entries && !entries.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No entries to Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };
