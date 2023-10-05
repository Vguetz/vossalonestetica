<?php 

namespace Model;

class Cita extends ActiveRecord {
    //Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id','fecha', 'usuarioId', 'hora'];

    public $id;
    public $fecha;
    public $usuarioId;
    public $hora;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->usuarioId = $args['usuarioId'] ?? '';
        $this->hora = $args['hora'] ?? '';
       
    }
}