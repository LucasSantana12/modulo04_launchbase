const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../utils')

exports.index = function(req, res) {


    return res.render("instructors/index", { instructors: data.instructors })
}

//SHOW = mostrar
exports.show = function(req, res) {
    //req.query
    //req.body
    //req.params
    const { id } = req.params

    //ACHEI O INSTRUTOR
    const foundInstructor = data.instructors.find(function(instructor) {
        return id == instructor.id
    })

    if (!foundInstructor) return res.send("instructors fot found")

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        create_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.create_at),
    }

    return res.render("instructors/show", { instructor })
}

exports.create = function(req, res) {
        return res.render('instructors/create')
    }
    //CREATE = CRIAR OS DADOS
exports.post = function(req, res) {
    //req.query
    //req.body
    // if(req.body.name !=""){
    //     return res.send(req.body.name   )
    // }

    const keys = Object.keys(req.body)

    for (key of keys) {
        //req.body.key==""
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos')
        }
    }
    // Destururação no javascript.

    // Destructuring (desestruturação) é uma expressão no Javascript
    // que possibilita ao usuário “desempacotar”
    // valores de um array ou propriedades de objetos, em variáveis diferentes!

    let { avatar_url, birth, name, services, gender } = req.body

    birth = Date.parse(birth)
    const create_at = Date.now()
    const id = Number(data.instructors.length + 1)


    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        services,
        gender,
        create_at,
    })

    //array vazio []

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("Write file error")

            return res.redirect("/instructors")
        })
        // return res.send(req.body) 
}

//EDIT = EDITAR

exports.edit = function(req, res) {

    const { id } = req.params

    //ACHEI O INSTRUTOR
    const foundInstructor = data.instructors.find(function(instructor) {
        return id == instructor.id
    })

    if (!foundInstructor) return res.send("instructors fot found")

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }



    return res.render('instructors/edit', { instructor })
}

//PUT = SALVAR NO BACKEND
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }

    })
    if (!foundInstructor) return res.send("instructors not found")

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error")

        return res.redirect(`/instructors/${id}`)
    })

}

//DELETE
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor) {
        return instructor.id != id
    })
    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error")

        return res.redirect("/instructors")
    })
}