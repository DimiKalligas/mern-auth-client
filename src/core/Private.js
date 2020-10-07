import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios' // make request to back-end when user signs up
import { isAuth, getCookie, signout, updateUser } from '../auth/helpers'
import { ToastContainer, toast } from 'react-toastify' // adds notifications
import 'react-toastify/dist/ReactToastify.min.css'

const Private = ({ history }) => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    })

    const token = getCookie('token')

    useEffect(() => {
        loadProfile()
    }, []) // [] is for dependencies

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: { // to get User's profile we need to be authorized
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE', response)
                const { role, name, email } = response.data
                setValues({ ...values, role, name, email })
            })
            .catch(error => { // token expired
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error)
                if (error.response.status === 401) {
                    signout(() => {
                        history.push('/')
                    })
                }
            })
    }

    const { role, name, email, password, buttonText } = values

    const handleChange = name => event => {
        // console.log(event.target.value)
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = event => {
        event.preventDefault()  // so that page will not reload
        setValues({ ...values, buttonText: 'Submitting' })
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/user/update`,
            headers: { // again, we need to be authorized
                Authorization: `Bearer ${token}`
            },
            data: { name, password }
        })
            .then(response => {
                console.log('Profile update success ', response)
                updateUser(response, () => {
                    setValues({ ...values, buttonText: 'Submitted' })
                    toast.success('Profile updated successfully')
                })
            })
            .catch(error => {
                console.log('Profile update error', error.response.data)
                setValues({ ...values, buttonText: 'Submit' })
                toast.error(error.response.data.error)
            })
    }



    // if we use {}, then we need a return
    const updateForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                {/* value makes for controlled component */}
                <input onChange={handleChange('name')} value={name} type="text" size="20" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">User role</label>
                {/* defaultValue because it will not be updatable */}
                <input defaultValue={role} type="text" size="20" className="form-control" disabled />
            </div>
            <div className="form-group">
                <label className="text-muted">email</label>
                {/* defaultValue because it will not be updatable */}
                <input defaultValue={email} type="text" size="20" className="form-control" disabled />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    )

    return (
        <Layout>
            <div className="col-d-6 offset-md-3">
                <ToastContainer /> {/* for toast messages to work */}
                {/* {JSON.stringify({ name, email, password })} */}
                <h1 className="pt-5 text-center">Private</h1>
                <p className="lead text-center">Profile Update</p>
                {updateForm()}

            </div>
        </Layout>
    )
}

export default Private