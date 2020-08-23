const fs = require('fs');
const data = require('../data.json');
const { date } = require('../utils')

exports.index = function(req, res) {


    return res.render("members/index", { members: data.members })
}

//SHOW = mostrar
exports.show = function(req, res) {
    //req.query
    //req.body
    //req.params
    const { id } = req.params

    //ACHEI O INSTRUTOR
    const foundMember = data.members.find(function(member) {
        return id == member.id
    })

    if (!foundMember) return res.send("members fot found")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render("members/show", { member })
}

exports.create = function(req, res) {
    return res.render('members/create')
}

//POST = CRIAR OS DADOS
exports.post = function(req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Por favor, preencha todos os campos')
        }
    }

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if (lastMember) {
        id = lastMember.id + 1
    }


    data.members.push({
        id,
        ...req.body,

        birth
    })

    //array vazio []

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send("Write file error")

            return res.redirect("/members")
        })
        // return res.send(req.body) 
}

//EDIT = EDITAR

exports.edit = function(req, res) {

    const { id } = req.params

    //ACHEI O INSTRUTOR
    const foundMember = data.members.find(function(member) {
        return id == member.id
    })

    if (!foundMember) return res.send("members fot found")

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }



    return res.render('members/edit', { member })
}

//PUT = SALVAR NO BACKEND
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex) {
        if (id == member.id) {
            index = foundIndex
            return true
        }

    })
    if (!foundMember) return res.send("members not found")

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error")

        return res.redirect(`/members/${id}`)
    })

}

//DELETE
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id
    })
    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error")

        return res.redirect("/members")
    })
}