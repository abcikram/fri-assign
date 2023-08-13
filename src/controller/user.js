import customerModel from '../model/customerModel.js'


export const addCustomer = async (req, res) => {
    try {
        const { phoneNumber, email } = req.body;

        const check = await customerModel.findOne({
            phoneNumber: phoneNumber,
            email: email
        })

        if (check) {
            return res.status(400).json({ status: false, message :"customer is alrady added" })
        }

        //customer exist :-
        const checkExist = await customerModel.find({
            $or: [
                { phoneNumber: { $in: [phoneNumber] } },
                { email: { $in: [email] } }
            ]
        }).sort({createdAt :1})
       
        //primary contacts turn into secondary , if checkEmail.length == 2
        // console.log(checkExist)
        if (checkExist.length > 1) {
            await customerModel.findOneAndUpdate({
                _id : checkExist[1]._id
            }, {
                $set: {
                    linkPrecedence: "secondary", linkedId  : 1            
                }
            })

            const obj = {
                primaryContatctId: 1,
                emails: [checkExist[0].email, checkExist[1].email],
                phoneNumbers: [checkExist[0].phoneNumber, checkExist[1].phoneNumber],
                secondaryContactIds: [1]
            }
            
            return res.status(200).json({ status: true, message: "switch primary to secondary", data: { "contact": obj}}) 
        }

        //if checkEmail.lenght ==1 means >0
        const linkPrecedence = checkExist.length > 0 ? "secondary" : "primary";
        const linkedId = checkExist.length > 0 ? checkExist.length : null

        const customerData = {
            ...req.body,
            linkedId: linkedId,
            linkPrecedence: linkPrecedence
        };

        const shownData = {
            primaryContactId: 1,
            emails: [req.body.email],
            phoneNumbers: [req.body.phoneNumber],
            secondaryContactIds: [linkedId]
        }

        // console.log(shownData)

        if (checkExist.length > 0) {
            for (const customer of checkExist) {
                shownData.emails.push(customer.email);
                shownData.phoneNumbers.push(customer.phoneNumber);
            }
        }

        // remove the duplicate elements of an array :-
        let uniqueEmails = [];
        shownData.emails.forEach(element => {
            if (!uniqueEmails.includes(element)) {
                uniqueEmails.push(element);
            }
        });

        let uniquePhoneNumbers = [];
        shownData.phoneNumbers.forEach(element => {
            if (!uniquePhoneNumbers.includes(element)) {
                uniquePhoneNumbers.push(element);
            }
        });

        //save the dataBase :-
        const newCustomer = new customerModel(customerData);
        const addedCustomer = await newCustomer.save();

        const newShownData = {
            primaryContactId: 1,
            emails: uniqueEmails,
            phoneNumbers: uniquePhoneNumbers,
            secondaryContactIds: [linkedId]
        }

        return res.status(200).json({ status: true, message: "Customer added successfully", data: newShownData });

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }

}

