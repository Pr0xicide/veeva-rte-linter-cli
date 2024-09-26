const {
  CATEGORY_TYPES,
} = require('veeva-approved-email-util/lib/tokens/category')
const { GRADE } = require('../../src/util/grading')
const { lint: validate } = require('../../src/token/content')

const lint = (token) => {
  return validate({
    line: 1,
    category: CATEGORY_TYPES.CONTENT,
    token: token,
  })
}

test('Valid standard content tokens', () => {
  expect(lint('{{accTitle}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{accFname}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{accLname}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{accCredentials}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{userEmailAddress}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{userName}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{userPhoto}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{parentCallDatetime}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{timeZone}}').getGrade()).toBe(GRADE.PASS)
})

test('Invalid standard content tokens', () => {
  expect(lint('{{acctitle}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{accfname}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{accsdfgdf}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{acccredentials}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{accMainCredentials}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{accCredential}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{username}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userAdfgdf}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{useremailaddress}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userEmailAddress1}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userEmailAddresses}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userphoto}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userPicture}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{userPic}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{parentcalldatetime}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{parentCallDatetimesdf}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{timezone}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{timeZone234}}').getGrade()).toBe(GRADE.ERROR)
})

test('Content tokens with invalid objects', () => {
  expect(lint('{{Custom_vod__c.1}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{Activity.1}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{Address_vod__c.1}}').getGrade()).toBe(GRADE.ERROR)
  expect(lint('{{Alert_vod__c.1}}').getGrade()).toBe(GRADE.ERROR)
})

// Object validation
test('Content tokens with account object/fields', () => {
  expect(lint('{{Account.FirstName}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{Account.LastName}}').getGrade()).toBe(GRADE.PASS)

  expect(lint('{{Account.CustomFieldName}}').getGrade()).toBe(GRADE.WARNING)
  expect(lint('{{Account.Last}}').getGrade()).toBe(GRADE.WARNING)
  expect(lint('{{Account.asdkfjasd}}').getGrade()).toBe(GRADE.WARNING)

  expect(lint('{{Account.Name.First}}').getGrade()).toBe(GRADE.ERROR)
})

test('Content tokens with approved document object/fields', () => {
  expect(
    lint('{{Approved_Document_vod.Email_From_Address_vod__c}}').getGrade()
  ).toBe(GRADE.PASS)
  expect(
    lint('{{Approved_Document_vod.Email_From_Name_vod__c}}').getGrade()
  ).toBe(GRADE.PASS)
  expect(
    lint('{{Approved_Document_vod.Email_ReplyTo_Address_vod__c}}').getGrade()
  ).toBe(GRADE.PASS)
  expect(
    lint('{{Approved_Document_vod.Email_ReplyTo_Name_vod__c}}').getGrade()
  ).toBe(GRADE.PASS)

  expect(lint('{{Approved_Document_vod.CustomFieldName}}').getGrade()).toBe(
    GRADE.WARNING
  )
  expect(lint('{{Approved_Document_vod.asdkfjasd}}').getGrade()).toBe(
    GRADE.WARNING
  )

  expect(lint('{{Approved_Document_vod.A.B}}').getGrade()).toBe(GRADE.ERROR)
})

test('Content tokens with call object/fields', () => {
  expect(lint('{{Call2_vod.Address_vod__c}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{Call2_vod.Address_Line_1_vod__c}}').getGrade()).toBe(
    GRADE.PASS
  )

  expect(lint('{{Call2_vod.CustomFieldName}}').getGrade()).toBe(GRADE.WARNING)
  expect(lint('{{Call2_vod.asdkfjasd}}').getGrade()).toBe(GRADE.WARNING)

  expect(lint('{{Call2_vod.A.B}}').getGrade()).toBe(GRADE.ERROR)
})

test('Content tokens with user object/fields', () => {
  expect(lint('{{User.Phone}}').getGrade()).toBe(GRADE.PASS)
  expect(lint('{{User.MobilePhone}}').getGrade()).toBe(GRADE.PASS)

  expect(lint('{{User.MobilePhone1}}').getGrade()).toBe(GRADE.WARNING)
  expect(lint('{{User.CustomFieldName}}').getGrade()).toBe(GRADE.WARNING)

  expect(lint('{{User.Name.First}}').getGrade()).toBe(GRADE.ERROR)
})

test('Content tokens with user detail object/fields', () => {
  expect(
    lint('{{User_Detail_vod.Digital_Business_Card_Country_vod__c}}').getGrade()
  ).toBe(GRADE.PASS)
  expect(lint('{{User_Detail_vod.Home_City_vod__c}}').getGrade()).toBe(
    GRADE.PASS
  )
  expect(lint('{{User_Detail_vod.Home_Country_vod__c}}').getGrade()).toBe(
    GRADE.PASS
  )
  expect(lint('{{User_Detail_vod.Home_Zip_vod__c}}').getGrade()).toBe(
    GRADE.PASS
  )

  expect(lint('{{User_Detail_vod.CustomFieldName}}').getGrade()).toBe(
    GRADE.WARNING
  )
  expect(lint('{{User_Detail_vod.asdkfjasd}}').getGrade()).toBe(GRADE.WARNING)

  expect(lint('{{User_Detail_vod.A.B}}').getGrade()).toBe(GRADE.ERROR)
})
