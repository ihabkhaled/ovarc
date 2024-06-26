import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import Book from './book';
import BookStore from './store_book';

@Table
class Store extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    address!: string;

    @BelongsToMany(() => Book, () => BookStore)
    books!: Book[];
}

export default Store;