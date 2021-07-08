import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resident {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  image: string;

  @ApiProperty()
  @Column({ nullable: true })
  ho_ten: string;

  @ApiProperty()
  @Column({ nullable: true })
  age: number;

  @ApiProperty()
  @Column({ nullable: true })
  shsq: string;

  @ApiProperty()
  @Column({ nullable: true })
  nam_sinh: Date;

  @ApiProperty()
  @Column({ nullable: true })
  que_quan: string;

  @ApiProperty()
  @Column({ nullable: true })
  tru_quan: string;

  @ApiProperty()
  @Column({ nullable: true })
  dia_chi: string;

  @ApiProperty()
  @Column({ nullable: true })
  van_hoa: string;

  @ApiProperty()
  @Column({ nullable: true })
  dan_toc: string;

  @ApiProperty()
  @Column({ nullable: true })
  doan_vien: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  dang: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  ngay_vao_dang: Date;

  @ApiProperty()
  @Column({ nullable: true })
  ton_giao: string;

  @ApiProperty()
  @Column({ nullable: true })
  suc_khoe: number;

  @ApiProperty()
  @Column({ nullable: true })
  nghe_nghiep: string;

  @ApiProperty()
  @Column({ nullable: true })
  noi_lam_viec: string;

  @ApiProperty()
  @Column({ nullable: true })
  so_dien_thoai: string;

  @ApiProperty()
  @Column({ nullable: true })
  ho_ten_cha: string;

  @ApiProperty()
  @Column({ nullable: true })
  ho_ten_me: string;

  @ApiProperty()
  @Column({ nullable: true })
  ho_ten_vo: string;

  @ApiProperty()
  @Column({ nullable: true })
  so_con: number;

  @ApiProperty()
  @Column({ nullable: true })
  thanh_phan_xuat_than: string;

  @ApiProperty()
  @Column({ nullable: true })
  nhap_ngu: Date;

  @ApiProperty()
  @Column({ nullable: true })
  xuat_ngu: Date;

  @ApiProperty()
  @Column({ nullable: true })
  ten_don_vi: string;

  @ApiProperty()
  @Column({ nullable: true })
  cap_bac: string;

  @ApiProperty()
  @Column({ nullable: true })
  chuc_vu: string;

  @ApiProperty()
  @Column({ nullable: true })
  ghi_chu: string;
}
