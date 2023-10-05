<?php

namespace Model;

class Servicio extends ActiveRecord {
    // DataBase

    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id', 'precio', 'nombre', 'tipo'];

    public $id;
    public $precio;
    public $nombre;
    public $tipo;

    public function __construct($args = []) 
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->precio = $args['precio'] ?? '';
        $this->precio = $args['tipo'] ?? '';
    }

    public function validar()
    { 
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El Nombre del Servicio es Obligatorio';
        }
        if(!$this->precio) {
            self::$alertas['error'][] = 'El Precio del Servicio es Obligatorio';
        }
        if(!is_numeric($this->precio)) {
            self::$alertas['error'][] = 'El precio no es válido';
        }

        return self::$alertas;
    }
}