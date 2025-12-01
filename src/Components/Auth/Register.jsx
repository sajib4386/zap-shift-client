import React from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../../Hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router'
import SocialLogin from './SocialLogin'
import axios from 'axios'

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const { creatUser, updateUserProfile } = useAuth()
    const location = useLocation();
    const navigate = useNavigate();

    const handleRegisterSubmit = (data) => {
        console.log(data.photo[0])
        const profileImg = data.photo[0];

        creatUser(data.email, data.password)
            .then(result => {
                console.log(result.user)

                // 1.Store the image in form data
                const formData = new FormData();
                formData.append('image', profileImg);

                // send the photo to store and get the url
                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOST_KEY}`

                axios.post(image_API_URL, formData)
                    .then(res => {
                        console.log(res.data)

                        // update user profile to firebase
                        const userProfile = {
                            displayName: data.name,
                            photoURL: res.data.data.url
                        }
                        updateUserProfile(userProfile)
                            .then(() => {
                                console.log('user profile updated done')
                                navigate(location?.state || "/")

                            })
                            .catch(error => {
                                console.log(error)
                            })
                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div>
            <div className='mb-5'>
                <h1 className='text-4xl font-bold'>Create an Account</h1>
                <p className='text-gray-500'>Register with ZapShift</p>
            </div>
            <div>
                <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                    <fieldset className="fieldset">
                        {/* Name */}
                        <label className="label">Name</label>
                        <input type="text" className="input" placeholder="Your Name" {...register("name", { required: true })} />
                        {errors.name?.type === "required" && (
                            <p className='text-red-500'>name is required</p>
                        )}

                        {/* Photo */}
                        <label className="label">Photo</label>
                        <input type="file" className="file-input" placeholder="Your Photo" {...register("photo", { required: true })} />
                        {errors.photo?.type === "required" && (
                            <p className='text-red-500'>photo is required</p>
                        )}

                        {/* Email */}
                        <label className="label">Email</label>
                        <input type="email" className="input" placeholder="Email" {...register("email", { required: true })} />
                        {errors.email?.type === "required" && (
                            <p className='text-red-500'>email is required</p>
                        )}

                        {/* Password */}
                        <label className="label">Password</label>
                        <input type="password" className="input" placeholder="Password"
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
                            })} />
                        {errors.password?.type === "required" && (
                            <p className='text-red-500'>password is required</p>
                        )}

                        {errors.password?.type === "minLength" && (
                            <p className='text-red-500'>password must be 6 characters or longer</p>
                        )}
                        {errors.password?.type === "pattern" && (
                            <p className='text-red-500'>Password must be at least 6 characters, include uppercase, lowercase, number, and special character.</p>
                        )}

                        <button className="btn bg-primary mt-4">register</button>
                    </fieldset>
                    <p>Already have an account? <Link
                        state={location.state}
                        to="/login"
                        className='text-xl font-bold text-secondary underline'>Login</Link></p>

                    <SocialLogin></SocialLogin>

                </form>
            </div>
        </div>
    )
}

export default Register