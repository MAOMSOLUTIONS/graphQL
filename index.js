/*** 
 * GraphQL POC usign APolloServer 
 * 
 * 
*/


import { ApolloServer,UserInputError, gql } from "apollo-server";
import {v1 as uuid} from "uuid"

// data array
const persons = [
    {
        age:47,
        name:"Mike",
        phone:"5611777267",
        street:"Corona 50",
        city:"CDMX",
        id:"1"
    },
    {
        age:12,
        name:"Abril",
        phone:"5611777267",
        street:"Corona 50",
        city:"CDMX",
        id:"2"
    },
    {
        age:20,
        name:"Chow",
        phone:"5611777267",
        street:"Corona 50",
        city:"CDMX",
        id:"3"
    },
    {
        age:2,
        name:"Luna",
        phone:"5611777267",
        street:"Corona 50",
        city:"CDMX",
        id:"4"
    },
    {
        age:2,
        name:"Michi",
        phone:"5611777267",
        street:"Corona 50",
        city:"CDMX",
        id:"5"
    },

]

/*Schema´s*/
const typeDefinitions = gql`
    type Address{
        street:String!
        city:String!
    }
    type Person {
        age: Int!
        name:String!
        phone:String
        address:Address!
        check:String!
        id:ID!
    }
    type Query{
        personCount:Int!
        allPersons:[Person]!
        findPersons(name:String!):Person

    }
    type Mutation{
        addPerson(
            age:Int!
            name:String!
            phone:String
            street:String!
            city:String!
        ):Person
    }
`
/*Resolver´s*/
const resolvers ={
    Query:{
        personCount:() => persons.length,
        allPersons:()=> persons,
        findPersons:(root,args) => {    
            const {name} = args
            return persons.find(person => person.name === name)
        }
    },
    Mutation:{
        addPerson:(root,args) => {
            if(person.find(person => person.name === args.name)){
                throw new UserInputError('Name must be unique',{
                    invalidArgs:args.name
                })
            }
            //const{name,phone,street,city} = args
            const person = {...args,id:uuid()}
            person.push(person) //update database
            return person
        }
    },
    Person:{
        address:(root) =>{
            return{
                street:root.street,
                city:root.city
            }
        }
    }
/*    Person:{    
        address:(root) => `${root.street},${root.city}`,
        check:()=>"midu"
    }
*/    
}

/*Server initialization */
const server = new ApolloServer({
    playground: true,
    typeDefs: typeDefinitions, 
    resolvers
})

server.listen().then(({url}) =>{
    console.log(`server ready at ${url}`)
})