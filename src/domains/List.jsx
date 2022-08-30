import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { domainService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [domains, setDomains] = useState(null);

    useEffect(() => {
        domainService.getAll().then(x => setDomains(x));
    }, []);

    function deleteDomain(id) {
        setDomains(domains.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        domainService.delete(id).then(() => {
            setDomains(domains => domains.filter(x => x.id !== id));
        });
    }

    function editDomain(id) {
        // setDomains(domains.map(x => {
        //     if (x.id === id) { x.isDeleting = true; }
        //     return x;
        // }));
        // domainService.delete(id).then(() => {
        //     setDomains(domains => domains.filter(x => x.id !== id));
        // });
        console.log(id);
    }



    return (
        <div>
            <h1>Domain</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Domain</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>DHid</th>
                        <th style={{ width: '20%' }}>Domain</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {domains && domains.map(domain =>
                        <tr key={domain.id}>
                            <td>{domain.domhand}</td>
                            <td>{domain.domain}</td>

                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${domain.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteDomain(domain.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={domain.isDeleting}>
                                    {domain.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>

                                <button onClick={() => editDomain(domain.id)} className="btn btn-sm btn-outline-info" disabled={domain.isDeleting}>
                                    {domain.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Configure</span>
                                    }
                                </button>


                            </td>
                        </tr>
                    )}
                    {!domains &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {domains && !domains.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Domains to Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };
