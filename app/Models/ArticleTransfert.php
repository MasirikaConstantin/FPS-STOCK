<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleTransfert extends Model
{
    use HasFactory;

    protected $fillable = [
        'transfert_id',
        'medical_produit_id',
        'stock_source_id',
        'quantite',
        'status',
        'ref',
        "from_central",
        'created_by',
        'updated_by'
    ];


    public function sourceLocation()
    {
        return $this->belongsTo(Hopital::class, 'source_location_id');
    }

    public function destinationLocation()
    {
        return $this->belongsTo(Hopital::class, 'destination_location_id');
    }

    
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }

    public function medicalProduit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }

    public function stockSource()
    {
        return $this->belongsTo(Stock::class, 'stock_source_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_source_id');
    }
    
}
