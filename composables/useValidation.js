import { object, string, number } from 'yup';
import { compareAsc } from 'date-fns';

export const useValidation = (consultingInfo) => {
  const schema = computed(() =>{
    let baseRules = {
      name: string().required('Поле обовязкове').max(20, 'Максимальна довжина 20 символів'),
      surname: string().required('Поле обовязкове').max(30, 'Максимальна довжина 30 символів'),
      description: string().max(500, 'Максимальна довжина 500 символів'),
      dates: string().required('Поле обовязкове')
      .test(
        'date-count',
        'Мінімальна кількість дат 1, максимальна 10',
        function (value) {
          const dates = value.split(',');
          return dates.length > 0 && dates.length <= 10;
        }),
    };
    
    if (consultingInfo.length) {
      consultingInfo.forEach((el) => {
        baseRules[`${el.id}-starttime`] = string().required('Поле обовязкове');
        baseRules[`${el.id}-endtime`] = string().required('Поле обовязкове').test(
          'is-greater',
          'Час закінчення повинен бути пізніше часу початку',
          function (value) {
            return compareAsc(el.endtime, el.starttime) !== -1;
        });
        baseRules[`${el.id}-price`] = number()
          .typeError('Введіть число')
          .min(0, 'Мінімальна ціна 0 грн')
          .max(3000, 'Максимальна ціна 3000 грн')
          .required('Поле обовязкове');
      });
    }
  
    return object().shape(baseRules);
  });

  return schema;
}