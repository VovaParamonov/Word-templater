export interface IFormRowModel<T extends FormRowModelTypeType> {
  getId: () => string;
  getPublicName: () => string;
  getRequired: () => boolean;
  getDescription: () => string;
  toDescriptor: () => IFormRowModelDescriptor<T>;
  getType: () => FormRowModelTypeType;
  clone: (update: Partial<IFormRowModelDescriptor<T>>) => FormRowModel<T>;
  update: (update: Partial<IFormRowModelDescriptor<T>>) => FormRowModel<FormRowModelTypeType>;
}

export interface IFormRowModelDescriptor<T extends FormRowModelTypeType> {
  id?: string;
  publicName?: string;
  required?: boolean;
  description?: string;
  type?: T;
}

export type FormRowModelTypeType = 'calc' | 'input';

export abstract class FormRowModel<T extends FormRowModelTypeType = 'input'>
  implements IFormRowModel<T>
{
  protected readonly _id: string;
  protected readonly _publicName: string;
  protected readonly _required: boolean;
  protected readonly _description: string;
  // TODO: Заменить на наследование классов
  protected readonly _type: T;

  protected constructor(descriptor: IFormRowModelDescriptor<T> = {}) {
    this._id = descriptor.id || Math.random().toString(16).slice(2);
    this._publicName = descriptor.publicName || '';
    this._required = descriptor.required || false;
    this._description = descriptor.description || '';
    this._type = descriptor.type || ('input' as T);
  }

  getDescription(): string {
    return this._description;
  }

  getId(): string {
    return this._id;
  }

  getPublicName(): string {
    return this._publicName;
  }

  getRequired(): boolean {
    return this._required;
  }

  toDescriptor(): IFormRowModelDescriptor<T> {
    return {
      id: this._id,
      publicName: this._publicName,
      required: this._required,
      description: this._description,
      type: this._type
    };
  }

  abstract clone(update: Partial<IFormRowModelDescriptor<T>>): FormRowModel<T>;

  update(
    update: Partial<IFormRowModelDescriptor<FormRowModelTypeType>>
  ): FormRowModel<FormRowModelTypeType> {
    return FormRowModel.deserialize({
      ...this.toDescriptor(),
      ...update
    });
  }

  getType(): FormRowModelTypeType {
    return this._type;
  }

  static serialize<T extends FormRowModelTypeType>(
    formRowModel: FormRowModel<T>
  ): IFormRowModelDescriptor<T> {
    return formRowModel.toDescriptor();
  }
  static deserialize(formRowModelDescriptor: IFormInputRowDescription): FormInputRowModel;
  static deserialize(
    formRowModelDescriptor: IFormRowModelDescriptor<FormRowModelTypeType>
  ): FormRowModel<FormRowModelTypeType>;
  static deserialize(formRowModelDescriptor: IFormCalculatedRowDescription): FormCalculatedRowModel;
  static deserialize(
    formRowModelDescriptor: IFormInputRowDescription | IFormCalculatedRowDescription
  ): FormInputRowModel | FormCalculatedRowModel;
  static deserialize(
    formRowModelDescriptor: IFormInputRowDescription | IFormCalculatedRowDescription
  ): FormInputRowModel | FormCalculatedRowModel {
    switch (formRowModelDescriptor.type) {
      case 'calc':
        return new FormCalculatedRowModel(formRowModelDescriptor);
      case 'input':
        return new FormInputRowModel(formRowModelDescriptor);
      case undefined:
        return new FormInputRowModel(formRowModelDescriptor as IFormInputRowDescription);
    }
  }
}

export interface IFormInputRowDescription extends IFormRowModelDescriptor<'input'> {}

export class FormInputRowModel extends FormRowModel<'input'> {
  constructor(description: IFormInputRowDescription = {}) {
    super({
      publicName: 'Безымянное поле для ввода',
      ...description,
      type: 'input'
    });
  }

  clone(update: Partial<IFormInputRowDescription>): FormInputRowModel {
    return new FormInputRowModel({
      ...this.toDescriptor(),
      ...update
    });
  }
}

export interface IFormCalculatedRowDescription extends IFormRowModelDescriptor<'calc'> {
  calcPattern: string;
}

export interface IFormCalculatedRowModel extends IFormRowModel<'calc'> {
  calcPattern: () => string;
  getCalcPattern: () => string;
}

export class FormCalculatedRowModel
  extends FormRowModel<'calc'>
  implements IFormCalculatedRowModel
{
  _calcPattern: string;
  constructor(description: IFormCalculatedRowDescription) {
    super({
      publicName: 'Безымянное рассчитываемое поле',
      ...description,
      type: 'calc'
    });

    this._calcPattern = description.calcPattern;
  }

  toDescriptor(): IFormCalculatedRowDescription {
    return {
      ...super.toDescriptor(),
      calcPattern: this._calcPattern
    };
  }

  clone(update: Partial<IFormCalculatedRowDescription>): FormCalculatedRowModel {
    return new FormCalculatedRowModel({
      ...this.toDescriptor(),
      ...update
    });
  }

  /**
   * Make calculation accordance with current calc pattern and given filling data
   * @param fillingData
   */
  calcPattern(fillingData?: Record<string, number>): string {
    if (!fillingData) {
      return this._calcPattern;
    }

    const reg = /\$.*?\$/gm;
    let result;
    let parsedStr = this._calcPattern;

    while ((result = reg.exec(parsedStr)) !== null) {
      const key = result[0].slice(1, -1);

      if (!(key in fillingData)) {
        throw new Error('Не удалось найти ключ прописанный в формуле: ' + result[0]);
      }

      parsedStr = parsedStr.replace(result[0], fillingData[key].toString());
      reg.lastIndex = 0;
    }

    return parsedStr;
  }

  getCalcPattern(): string {
    return this._calcPattern;
  }
}
