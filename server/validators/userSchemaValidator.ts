// import { body, checkSchema } from 'express-validator'

// export const checkschema =checkSchema({
//     email: {
//         isEmail: true,
//         errorMessage: 'Invalid email format'
//     },
//     password: {
//         isLength: {
//             options: { min: 8 },
//             errorMessage: 'Password must be at least 8 characters long'
//         }
//     },
//     passwordConfirm: {
//         custom: {
//             options: (value, { req }) => value === req.body.password,
//             errorMessage: 'Passwords do not match'
//         }
//     }
// })