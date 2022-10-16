import { client } from "../pages/_app"

export const auth = async() => {
    console.log(client.authStore)
    const response = client.authStore.isValid
    return response
}
export const isAuthed = () => client.authStore.isValid