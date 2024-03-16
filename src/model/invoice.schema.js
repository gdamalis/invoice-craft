import * as yup from "yup";

const itemSchema = yup.object().shape({
  name: yup.string().required(),
  quantity: yup.number().required(),
  unit_cost: yup.number().required(),
  description: yup.string(),
});

const fieldsSchema = yup.object().shape({
  tax: yup.string().required(),
  discounts: yup.boolean().required(),
  shipping: yup.boolean().required(),
});

export const invoiceSchema = yup.object().shape({
  number: yup.string().required(),
  date: yup.date().required(),
  from: yup.string().required(),
  to: yup.string().required(),
  ship_to: yup.string().required(),
  due_date: yup.date().required(),
  payment_terms: yup.string().required(),
  items: yup.array().of(itemSchema).required(),
  fields: fieldsSchema,
  tax: yup.number().required(),
  created_at: yup.date().default(() => new Date()),
});
