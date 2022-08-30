import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { domainService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    // form validation rules
    const validationSchema = Yup.object().shape({
        domain: Yup.string()
            .required('Domain is required'),
        domhand: Yup.string()
            .required('Domain Handle is required'),
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createDomain(data)
            : updateDomain(id, data);
    }

    function createDomain(data) {
        return domainService.create(data)
            .then(() => {
                alertService.success('Domain added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateDomain(id, data) {
        return domainService.update(id, data)
            .then(() => {
                alertService.success('Domain updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        if (!isAddMode) {
            // get user and set form fields
            domainService.getById(id).then(domain => {
                const fields = ['domain', 'domhand'];
                fields.forEach(field => setValue(field, domain[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add Domain' : 'Edit Domain'}</h1>
            <div className="form-row">
              <div className="form-group col-7">
                  <label>Domain</label>
                  <input name="domain" type="text" ref={register} className={`form-control ${errors.domain ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.domain?.message}</div>
              </div>
              <div className="form-group col-7">
                  <label>Domain Handle</label>
                  <input name="domhand" type="text" ref={register} className={`form-control ${errors.domhand ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.domhand?.message}</div>
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
