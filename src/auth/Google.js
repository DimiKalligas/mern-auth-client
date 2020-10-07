// this is part of the Signin component
// so, we should pass the response from Google to Signin
import React from 'react'
import axios from 'axios'
import GoogleLogin from 'react-google-login'

const Google = ({ informParent = f => f }) => {
    const responseGoogle = response => {
        console.log(response.tokenId)
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/google-login`,
            data: { idToken: response.tokenId }
        })
            .then(response => {
                console.log('GOOGLE SIGNIN SUCCESS', response)
                // inform parent component
                informParent(response)
            })
            .catch(err => {
                console.log('GOOGLE SIGNIN ERROR', err)
            })
    }
    return (
        <div className="pb-3">
            <GoogleLogin  // code taken from reac-google-login npm page
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                render={renderProps => (  // custom button code taken from reac-google-login npm page
                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="btn btn-danger btn-lg btn-block">
                        <i className="fab fa-google pr-2"></i>Login with Google</button>
                )}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}


export default Google