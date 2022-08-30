import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { domainEntrieService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    // form validation rules
    const validationSchema = Yup.object().shape({
        domain: Yup.string()
            .required('Domain is required'),
        name: Yup.string()
            .nullable()
            .notRequired()
            .transform(x => x === '' ? undefined : x)
            .min(2, 'Name(Record) if required, it need to be at least 2 characters'),
        ttl: Yup.string()
            .required('TTL is required'),
        type: Yup.string()
            .required('Record Type is required'),
        record: Yup.string()
            .required('Record is required'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createDomainEntrie(data)
            : updateDomainEntrie(id, data);
    }

    function createDomainEntrie(data) {
        return domainEntrieService.create(data)
            .then(() => {
                alertService.success('Entrie added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateDomainEntrie(id, data) {
        return domainEntrieService.update(id, data)
            .then(() => {
                alertService.success('Entrie updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        if (!isAddMode) {
            // get user and set form fields
            domainEntrieService.getById(id).then(domain => {
                const fields = ['domain', 'name', 'ttl', 'type', 'record'];
                fields.forEach(field => setValue(field, domain[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add Record' : 'Edit Record'}</h1>
            <div className="form-row">
              <div className="form-group col-7">
                  <label>Domain</label>
                  <input name="domain" type="hidden" ref={register} className={`form-control ${errors.domain ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.domain?.message}</div>
              </div>

              <div className="form-group col-7">
                  <label>Name</label>
                  <input name="name" type="text" ref={register} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.name?.message}</div>
              </div>

              <div className="form-group col-7">
                  <label>TTL</label>
                  <input name="ttl" type="text" ref={register} className={`form-control ${errors.ttl ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.ttl?.message}</div>
              </div>

              <div className="form-group col-7">
                  <label>Type</label>
                  <input name="type" type="text" ref={register} className={`form-control ${errors.type ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.type?.message}</div>
              </div>

              <div className="form-group col-7">
                  <label>Record</label>
                  <input name="record" type="text" ref={register} className={`form-control ${errors.record ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.record?.message}</div>
              </div>


          </div>

          <div className="form-group">
              <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                  {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  Save
              </button>
              <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
          </div>
      </form>
  );
}

export { AddEdit };
