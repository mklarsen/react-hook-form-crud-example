import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    // form validation rules
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        role: Yup.string()
            .required('Role is required'),
        domhand: Yup.string()
            .required('Domain handle is required'),
        address1: Yup.string()
            .required('Address is required')
            .min(6, 'Address must be at least 6 characters'),
        address2: Yup.string()
          .nullable()
          .notRequired()
          .transform(x => x === '' ? undefined : x)
          .min(6, 'Address must be at least 6 characters'),
        taxid: Yup.string()
          .nullable()
          .notRequired()
          .transform(x => x === '' ? undefined : x)
          .min(5, 'TaxID must be at least 5 characters'),
        corpname: Yup.string()
          .nullable()
          .notRequired()
          .transform(x => x === '' ? undefined : x)
          .min(2, 'Company name must be at least 2 characters'),
        postno: Yup.string()
            .required('Post number is required')
            .min(4, 'Post number must be at least 4 characters'),
        city: Yup.string()
            .required('City is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .concat(isAddMode ? Yup.string().required('Password is required') : null)
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .transform(x => x === '' ? undefined : x)
            .when('password', (password, schema) => {
                if (password || isAddMode) return schema.required('Confirm Password is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createUser(data)
            : updateUser(id, data);
    }

    function createUser(data) {
        return userService.create(data)
            .then(() => {
                alertService.success('User added', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(alertService.error);
    }

    useEffect(() => {
        if (!isAddMode) {
            // get user and set form fields
            userService.getById(id).then(user => {
                const fields = ['title', 'firstName', 'lastName', 'email', 'role', 'domhand', 'corpname', 'address1', 'address2', 'postno', 'city', 'taxid' ];
                fields.forEach(field => setValue(field, user[field]));
            });
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
            <div className="form-row">
                <div className="form-group col">
                    <label>Title</label>
                    <select name="title" ref={register} className={`form-control ${errors.title ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Ms">Ms</option>
                    </select>
                    <div className="invalid-feedback">{errors.title?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>First Name</label>
                    <input name="firstName" type="text" ref={register} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="form-group col-5">
                    <label>Last Name</label>
                    <input name="lastName" type="text" ref={register} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
            </div>

            <div className="form-row">
              <div className="form-group col-7">
                  <label>Company</label>
                  <input name="corpname" type="text" ref={register} className={`form-control ${errors.corpname ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.corpname?.message}</div>
              </div>
              <div className="form-group col-5">
                  <label>TaxID/CVR</label>
                  <input name="taxid" type="text" ref={register} className={`form-control ${errors.taxid ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.taxid?.message}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-7">
                  <label>Address</label>
                  <input name="address1" type="text" ref={register} className={`form-control ${errors.address1 ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.address1?.message}</div>
                  <input name="address2" type="text" ref={register} className={`form-control ${errors.address2 ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.address2?.message}</div>
              </div>

              <div className="form-group col-5">
                  <label>Post number</label>
                  <input name="postno" type="text" ref={register} className={`form-control ${errors.postno ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.postno?.message}</div>
                  <label>City</label>
                  <input name="city" type="text" ref={register} className={`form-control ${errors.city ? 'is-invalid' : ''}`} />
                  <div className="invalid-feedback">{errors.city?.message}</div>
              </div>
            </div>

            <div className="form-row">
                <div className="form-group col-7">
                    <label>Email</label>
                    <input name="email" type="text" ref={register} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.email?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Role</label>
                    <select name="role" ref={register} className={`form-control ${errors.role ? 'is-invalid' : ''}`}>
                        <option value=""></option>
                        <option value="User">User</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <div className="invalid-feedback">{errors.role?.message}</div>
                </div>

                <div className="form-group col-7">
                    <label>Domain Handle</label>
                    <input name="domhand" type="text" ref={register} className={`form-control ${errors.domhand ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.domhand?.message}</div>
                </div>

            </div>
            {!isAddMode &&
                <div>
                    <h3 className="pt-3">Change Password</h3>
                    <p>Leave blank to keep the same password</p>
                </div>
            }
            <div className="form-row">
                <div className="form-group col">
                    <label>Password</label>
                    <input name="password" type="password" ref={register} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>
                <div className="form-group col">
                    <label>Confirm Password</label>
                    <input name="confirmPassword" type="password" ref={register} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
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
